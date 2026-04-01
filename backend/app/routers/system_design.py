"""
System Design Router — handles system design preparation.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.schemas.system_design import SystemDesignRequest, SystemDesignOut
from app.agents.system_design_agent import SystemDesignAgent
from app.services.youtube_service import search_youtube
from app.models.system_design import SystemDesignTopic

router = APIRouter(prefix="/api/system-design", tags=["system-design"])

SYSTEM_DESIGN_TOPICS = [
    {"title": "URL Shortener (like TinyURL)", "category": "Web Service"},
    {"title": "Chat System (like WhatsApp/Messenger)", "category": "Real-time"},
    {"title": "News Feed (like Facebook/Twitter)", "category": "Social Media"},
    {"title": "Video Streaming (like YouTube/Netflix)", "category": "Media"},
    {"title": "Ride Sharing (like Uber/Lyft)", "category": "Location-based"},
    {"title": "E-commerce (like Amazon)", "category": "Marketplace"},
    {"title": "Search Engine (like Google)", "category": "Search"},
    {"title": "Notification System", "category": "Infrastructure"},
    {"title": "Rate Limiter", "category": "Infrastructure"},
    {"title": "Distributed Cache (like Redis)", "category": "Infrastructure"},
    {"title": "Message Queue (like Kafka)", "category": "Infrastructure"},
    {"title": "Key-Value Store", "category": "Database"},
    {"title": "Web Crawler", "category": "Data Processing"},
    {"title": "Payment System (like Stripe)", "category": "FinTech"},
    {"title": "File Storage (like Google Drive/Dropbox)", "category": "Storage"},
]


@router.get("/topics")
async def list_topics():
    return SYSTEM_DESIGN_TOPICS


@router.post("/analyze", response_model=SystemDesignOut)
async def analyze_system_design(body: SystemDesignRequest, db: AsyncSession = Depends(get_db)):
    # Check cache
    stmt = select(SystemDesignTopic).where(SystemDesignTopic.title == body.topic)
    result = await db.execute(stmt)
    cached = result.scalar_one_or_none()

    if cached:
        try:
            yt = await search_youtube(f"system design {body.topic} interview", max_results=5)
        except Exception:
            yt = []
        return SystemDesignOut(
            title=cached.title,
            category=cached.category,
            requirements=cached.requirements_text,
            high_level_design=cached.high_level_design,
            deep_dive=cached.deep_dive,
            youtube_links=yt,
        )

    # Run agent
    agent = SystemDesignAgent()
    context = {"topic": body.topic}
    full_text = await agent.run(context, body.level)

    # Parse sections (best-effort)
    requirements = ""
    high_level = ""
    deep_dive = ""

    sections = full_text.split("##")
    for section in sections:
        lower = section.lower()
        if "requirement" in lower or "estimation" in lower:
            requirements += section.strip() + "\n\n"
        elif "high" in lower and "level" in lower or "api" in lower or "data model" in lower:
            high_level += section.strip() + "\n\n"
        elif "deep" in lower or "scal" in lower or "trade" in lower or "interview" in lower:
            deep_dive += section.strip() + "\n\n"

    if not requirements:
        requirements = full_text
    if not high_level:
        high_level = full_text
    if not deep_dive:
        deep_dive = full_text

    # Determine category
    category = "General"
    for t in SYSTEM_DESIGN_TOPICS:
        if t["title"].lower() in body.topic.lower() or body.topic.lower() in t["title"].lower():
            category = t["category"]
            break

    # Store in DB
    record = SystemDesignTopic(
        title=body.topic,
        category=category,
        description=body.topic,
        requirements_text=requirements,
        high_level_design=high_level,
        deep_dive=deep_dive,
        llm_provider="configured",
    )
    db.add(record)
    await db.commit()

    # YouTube
    try:
        yt = await search_youtube(f"system design {body.topic} interview", max_results=5)
    except Exception:
        yt = []

    return SystemDesignOut(
        title=body.topic,
        category=category,
        requirements=requirements,
        high_level_design=high_level,
        deep_dive=deep_dive,
        youtube_links=yt,
    )
