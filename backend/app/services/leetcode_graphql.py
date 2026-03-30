"""
LeetCode GraphQL Client — Direct integration with LeetCode's API.

Uses the user's LEETCODE_SESSION cookie for authenticated requests.
Public queries (problem fetch) work without auth.
Authenticated queries (profile, submissions, progress) require the session cookie.
"""

import re
import httpx

LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

# ── GraphQL Queries ──────────────────────────────────────────────────────────

QUERY_PROBLEM = """
query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        title
        titleSlug
        difficulty
        content
        topicTags { name slug }
        hints
        stats
        sampleTestCase
        likes
        dislikes
    }
}
"""

QUERY_PROBLEM_BY_ID = """
query problemsetQuestionList($filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
        categorySlug: ""
        limit: 1
        skip: 0
        filters: $filters
    ) {
        questions: data {
            questionId
            questionFrontendId
            title
            titleSlug
            difficulty
            topicTags { name slug }
        }
    }
}
"""

QUERY_USER_PROFILE = """
query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
        username
        profile {
            realName
            ranking
            userAvatar
            reputation
        }
        submitStatsGlobal {
            acSubmissionNum { difficulty count }
        }
    }
}
"""

QUERY_USER_STATUS = """
query globalData {
    userStatus {
        userId
        username
        realName
        avatar
        isSignedIn
        isPremium
    }
}
"""

QUERY_RECENT_SUBMISSIONS = """
query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
        lang
    }
}
"""

QUERY_USER_PROGRESS = """
query userProblemsSolved($username: String!) {
    matchedUser(username: $username) {
        submitStatsGlobal {
            acSubmissionNum {
                difficulty
                count
            }
        }
    }
    allQuestionsCount {
        difficulty
        count
    }
}
"""

QUERY_PROBLEM_LIST = """
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
    ) {
        total: totalNum
        questions: data {
            questionFrontendId
            title
            titleSlug
            difficulty
            topicTags { name }
            status
            paidOnly: isPaidOnly
        }
    }
}
"""


# ── Helper: build headers ────────────────────────────────────────────────────

def _build_headers(session_cookie: str | None = None, csrf_token: str | None = None) -> dict:
    headers = {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
        "Origin": "https://leetcode.com",
    }
    if session_cookie:
        cookie_parts = [f"LEETCODE_SESSION={session_cookie}"]
        if csrf_token:
            cookie_parts.append(f"csrftoken={csrf_token}")
            headers["x-csrftoken"] = csrf_token
        headers["Cookie"] = "; ".join(cookie_parts)
    return headers


def _clean_html(raw: str) -> str:
    clean = re.sub(r"<[^>]+>", " ", raw)
    clean = clean.replace("&lt;", "<").replace("&gt;", ">")
    clean = clean.replace("&amp;", "&").replace("&nbsp;", " ")
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean


# ── Public: Fetch problem by slug ────────────────────────────────────────────

async def graphql_fetch_problem(slug: str, session_cookie: str | None = None, csrf_token: str | None = None) -> dict:
    """Fetch a LeetCode problem by slug using the GraphQL API."""
    headers = _build_headers(session_cookie, csrf_token)
    payload = {
        "query": QUERY_PROBLEM,
        "variables": {"titleSlug": slug},
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(LEETCODE_GRAPHQL_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    question = data.get("data", {}).get("question")
    if not question:
        raise ValueError(f"Problem '{slug}' not found on LeetCode.")

    raw_tags = question.get("topicTags") or []
    tags = [t["name"] for t in raw_tags if isinstance(t, dict)]

    raw_content = question.get("content") or ""
    content = _clean_html(raw_content)

    qid = question.get("questionFrontendId") or question.get("questionId")

    return {
        "leetcode_id": int(qid) if qid else None,
        "title": question.get("title", slug),
        "slug": question.get("titleSlug", slug),
        "difficulty": (question.get("difficulty") or "unknown").lower(),
        "content": content,
        "tags": tags,
        "hints": question.get("hints") or [],
        "likes": question.get("likes", 0),
        "dislikes": question.get("dislikes", 0),
    }


async def graphql_fetch_problem_by_number(number: int, session_cookie: str | None = None, csrf_token: str | None = None) -> dict:
    """Fetch a problem by its frontend ID number."""
    headers = _build_headers(session_cookie, csrf_token)
    payload = {
        "query": QUERY_PROBLEM_BY_ID,
        "variables": {"filters": {"searchKeywords": str(number)}},
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(LEETCODE_GRAPHQL_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    questions = data.get("data", {}).get("problemsetQuestionList", {}).get("questions", [])
    match = None
    for q in questions:
        if str(q.get("questionFrontendId")) == str(number):
            match = q
            break

    if not match:
        raise ValueError(f"Problem #{number} not found on LeetCode.")

    return await graphql_fetch_problem(match["titleSlug"], session_cookie, csrf_token)


# ── Authenticated: User profile ──────────────────────────────────────────────

async def graphql_get_user_status(session_cookie: str, csrf_token: str | None = None) -> dict:
    """Verify session and get current user info."""
    headers = _build_headers(session_cookie, csrf_token)
    payload = {"query": QUERY_USER_STATUS, "variables": {}}

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(LEETCODE_GRAPHQL_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    user_status = data.get("data", {}).get("userStatus", {})
    if not user_status.get("isSignedIn"):
        raise ValueError("Session is invalid or expired. Please update your LEETCODE_SESSION cookie.")

    return {
        "user_id": user_status.get("userId"),
        "username": user_status.get("username", ""),
        "real_name": user_status.get("realName", ""),
        "avatar": user_status.get("avatar", ""),
        "is_premium": user_status.get("isPremium", False),
    }


async def graphql_get_user_profile(username: str, session_cookie: str | None = None, csrf_token: str | None = None) -> dict:
    """Get detailed user profile and solve stats."""
    headers = _build_headers(session_cookie, csrf_token)
    payload = {
        "query": QUERY_USER_PROFILE,
        "variables": {"username": username},
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(LEETCODE_GRAPHQL_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    user = data.get("data", {}).get("matchedUser")
    if not user:
        raise ValueError(f"User '{username}' not found.")

    profile = user.get("profile", {})
    ac_stats = user.get("submitStatsGlobal", {}).get("acSubmissionNum", [])

    stats = {}
    for s in ac_stats:
        stats[s["difficulty"].lower()] = s["count"]

    return {
        "username": user.get("username", ""),
        "real_name": profile.get("realName", ""),
        "ranking": profile.get("ranking"),
        "avatar": profile.get("userAvatar", ""),
        "reputation": profile.get("reputation", 0),
        "solved": {
            "all": stats.get("all", 0),
            "easy": stats.get("easy", 0),
            "medium": stats.get("medium", 0),
            "hard": stats.get("hard", 0),
        },
    }


async def graphql_get_user_progress(username: str, session_cookie: str | None = None, csrf_token: str | None = None) -> dict:
    """Get solve progress: solved vs total per difficulty."""
    headers = _build_headers(session_cookie, csrf_token)
    payload = {
        "query": QUERY_USER_PROGRESS,
        "variables": {"username": username},
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(LEETCODE_GRAPHQL_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    user = data.get("data", {}).get("matchedUser")
    all_questions = data.get("data", {}).get("allQuestionsCount", [])

    totals = {}
    for q in all_questions:
        totals[q["difficulty"].lower()] = q["count"]

    solved = {}
    if user:
        for s in user.get("submitStatsGlobal", {}).get("acSubmissionNum", []):
            solved[s["difficulty"].lower()] = s["count"]

    return {
        "easy": {"solved": solved.get("easy", 0), "total": totals.get("easy", 0)},
        "medium": {"solved": solved.get("medium", 0), "total": totals.get("medium", 0)},
        "hard": {"solved": solved.get("hard", 0), "total": totals.get("hard", 0)},
        "all": {"solved": solved.get("all", 0), "total": totals.get("all", 0)},
    }


async def graphql_get_recent_submissions(username: str, limit: int = 15, session_cookie: str | None = None, csrf_token: str | None = None) -> list[dict]:
    """Get recent accepted submissions."""
    headers = _build_headers(session_cookie, csrf_token)
    payload = {
        "query": QUERY_RECENT_SUBMISSIONS,
        "variables": {"username": username, "limit": limit},
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(LEETCODE_GRAPHQL_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    submissions = data.get("data", {}).get("recentAcSubmissionList", [])
    return [
        {
            "id": s.get("id"),
            "title": s.get("title", ""),
            "slug": s.get("titleSlug", ""),
            "timestamp": s.get("timestamp", ""),
            "language": s.get("lang", ""),
        }
        for s in submissions
    ]


async def graphql_get_problem_list(
    limit: int = 20,
    skip: int = 0,
    difficulty: str | None = None,
    tags: list[str] | None = None,
    status: str | None = None,
    session_cookie: str | None = None,
    csrf_token: str | None = None,
) -> dict:
    """Fetch problem list with filters. Status filter requires auth."""
    headers = _build_headers(session_cookie, csrf_token)
    filters: dict = {}
    if difficulty:
        filters["difficulty"] = difficulty.upper()
    if tags:
        filters["tags"] = tags
    if status:
        filters["status"] = status  # "AC", "NOT_STARTED", "TRIED"

    payload = {
        "query": QUERY_PROBLEM_LIST,
        "variables": {
            "categorySlug": "",
            "limit": limit,
            "skip": skip,
            "filters": filters,
        },
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(LEETCODE_GRAPHQL_URL, json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

    result = data.get("data", {}).get("problemsetQuestionList", {})
    questions = result.get("questions", [])

    return {
        "total": result.get("total", 0),
        "problems": [
            {
                "leetcode_id": int(q.get("questionFrontendId", 0)),
                "title": q.get("title", ""),
                "slug": q.get("titleSlug", ""),
                "difficulty": (q.get("difficulty") or "").lower(),
                "tags": [t["name"] for t in (q.get("topicTags") or [])],
                "status": q.get("status"),  # "ac", "notac", null
                "is_paid": q.get("paidOnly", False),
            }
            for q in questions
        ],
    }
