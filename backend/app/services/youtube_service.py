"""
YouTube Service — Searches YouTube for relevant tutorial videos.
Uses youtube-search-python (no API key needed) with optional YouTube Data API fallback.
"""

import httpx
from youtubesearchpython import VideosSearch
from app.config import get_settings


async def search_youtube(query: str, max_results: int = 5) -> list[dict]:
    """
    Search YouTube for videos matching the query.
    Returns list of {title, url, channel, thumbnail, duration}.
    """
    settings = get_settings()

    # If YouTube Data API key is available, use it for better results
    if settings.youtube_api_key:
        return await _search_with_api(query, max_results, settings.youtube_api_key)

    # Fallback: youtube-search-python (no key needed)
    return _search_with_library(query, max_results)


def _search_with_library(query: str, max_results: int) -> list[dict]:
    search = VideosSearch(query, limit=max_results)
    results = search.result().get("result", [])

    videos = []
    for v in results:
        videos.append({
            "title": v.get("title", ""),
            "url": f"https://www.youtube.com/watch?v={v.get('id', '')}",
            "channel": v.get("channel", {}).get("name", ""),
            "thumbnail": (v.get("thumbnails") or [{}])[0].get("url", ""),
            "duration": v.get("duration", ""),
        })
    return videos


async def _search_with_api(query: str, max_results: int, api_key: str) -> list[dict]:
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": api_key,
    }
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    videos = []
    for item in data.get("items", []):
        vid_id = item["id"].get("videoId", "")
        snippet = item.get("snippet", {})
        videos.append({
            "title": snippet.get("title", ""),
            "url": f"https://www.youtube.com/watch?v={vid_id}",
            "channel": snippet.get("channelTitle", ""),
            "thumbnail": snippet.get("thumbnails", {}).get("medium", {}).get("url", ""),
            "duration": "",
        })
    return videos
