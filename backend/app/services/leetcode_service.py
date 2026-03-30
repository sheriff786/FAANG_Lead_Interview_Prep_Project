"""
LeetCode Service — Fetches problem data from LeetCode via public API proxy.
Caches results in PostgreSQL to avoid repeated fetches.
"""

import re
import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.problem import Problem

LEETCODE_API = "https://leetcode-api-pied.vercel.app/problem"


async def fetch_from_leetcode(slug_or_id: str) -> dict:
    """Fetch problem from LeetCode API proxy."""
    cleaned = slug_or_id.strip().lower().replace(" ", "-")
    url = f"{LEETCODE_API}/{cleaned}"

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.json()

    if not data or data.get("error"):
        raise ValueError(data.get("error", "No data returned from LeetCode"))

    title = data.get("title") or data.get("question_title") or slug_or_id
    slug = data.get("title_slug") or data.get("slug") or cleaned
    difficulty = (data.get("difficulty") or "unknown").lower()
    qid = data.get("frontend_question_id") or data.get("question_id")
    raw_tags = data.get("topic_tags") or data.get("topicTags") or []
    tags = [t["name"] if isinstance(t, dict) else str(t) for t in raw_tags]

    raw_content = data.get("content") or data.get("body") or ""
    clean = re.sub(r"<[^>]+>", " ", raw_content)
    clean = clean.replace("&lt;", "<").replace("&gt;", ">")
    clean = clean.replace("&amp;", "&").replace("&nbsp;", " ")
    clean = re.sub(r"\s+", " ", clean).strip()

    return {
        "leetcode_id": int(qid) if qid else None,
        "title": title,
        "slug": slug,
        "difficulty": difficulty,
        "content": clean,
        "tags": tags,
    }


async def get_or_fetch_problem(slug_or_id: str, db: AsyncSession) -> dict:
    """Return cached problem or fetch fresh from LeetCode and store."""
    cleaned = slug_or_id.strip().lower().replace(" ", "-")

    # Try cache by slug
    stmt = select(Problem).where(Problem.slug == cleaned)
    result = await db.execute(stmt)
    cached = result.scalar_one_or_none()

    # Also try by numeric id
    if not cached and cleaned.isdigit():
        stmt = select(Problem).where(Problem.leetcode_id == int(cleaned))
        result = await db.execute(stmt)
        cached = result.scalar_one_or_none()

    if cached:
        return {
            "leetcode_id": cached.leetcode_id,
            "title": cached.title,
            "slug": cached.slug,
            "difficulty": cached.difficulty,
            "content": cached.content,
            "tags": cached.tags or [],
        }

    # Fetch live
    data = await fetch_from_leetcode(slug_or_id)

    # Store in DB
    problem = Problem(
        leetcode_id=data["leetcode_id"],
        title=data["title"],
        slug=data["slug"],
        difficulty=data["difficulty"],
        content=data["content"],
        tags=data["tags"],
    )
    db.add(problem)
    await db.commit()
    return data
