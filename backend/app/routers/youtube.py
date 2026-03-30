"""
YouTube Router — search for tutorial videos.
"""

from fastapi import APIRouter
from app.services.youtube_service import search_youtube

router = APIRouter(prefix="/api/youtube", tags=["youtube"])


@router.get("/search")
async def youtube_search(q: str, max_results: int = 5):
    results = await search_youtube(q, max_results=min(max_results, 10))
    return {"results": results}
