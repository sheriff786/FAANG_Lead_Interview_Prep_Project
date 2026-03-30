"""
LeetCode Auth Router — Connect LeetCode account, view profile & progress.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.leetcode_graphql import (
    graphql_get_user_status,
    graphql_get_user_profile,
    graphql_get_user_progress,
    graphql_get_recent_submissions,
    graphql_get_problem_list,
)

router = APIRouter(prefix="/api/leetcode-account", tags=["leetcode-account"])

# ── In-memory session store (per server process) ─────────────────────────────
# We do NOT persist session cookies to the database for security.

_active_session: dict | None = None


def get_active_session() -> dict | None:
    return _active_session


# ── Schemas ──────────────────────────────────────────────────────────────────

class ConnectRequest(BaseModel):
    session_cookie: str
    csrf_token: str | None = None


class ConnectResponse(BaseModel):
    connected: bool
    username: str
    real_name: str
    avatar: str
    is_premium: bool


class ProfileResponse(BaseModel):
    username: str
    real_name: str
    ranking: int | None
    avatar: str
    reputation: int
    solved: dict


class ProgressResponse(BaseModel):
    easy: dict
    medium: dict
    hard: dict
    all: dict


class SubmissionItem(BaseModel):
    id: str | None
    title: str
    slug: str
    timestamp: str
    language: str


class ProblemListRequest(BaseModel):
    limit: int = 20
    skip: int = 0
    difficulty: str | None = None
    tags: list[str] | None = None
    status: str | None = None  # "AC", "NOT_STARTED", "TRIED"


# ── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/connect", response_model=ConnectResponse)
async def connect_leetcode(body: ConnectRequest):
    """Verify LeetCode session cookie and store connection."""
    global _active_session
    try:
        user = await graphql_get_user_status(body.session_cookie, body.csrf_token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to connect to LeetCode. Check your session cookie.")

    _active_session = {
        "session_cookie": body.session_cookie,
        "csrf_token": body.csrf_token,
        "username": user["username"],
    }

    return ConnectResponse(
        connected=True,
        username=user["username"],
        real_name=user["real_name"],
        avatar=user["avatar"],
        is_premium=user["is_premium"],
    )


@router.get("/status")
async def connection_status():
    """Check if LeetCode account is connected."""
    if _active_session:
        return {
            "connected": True,
            "username": _active_session["username"],
        }
    return {"connected": False, "username": None}


@router.post("/disconnect")
async def disconnect_leetcode():
    """Disconnect LeetCode account."""
    global _active_session
    _active_session = None
    return {"connected": False}


@router.get("/profile", response_model=ProfileResponse)
async def get_profile():
    """Get connected user's LeetCode profile."""
    if not _active_session:
        raise HTTPException(status_code=401, detail="Not connected to LeetCode. Connect your account first.")

    try:
        profile = await graphql_get_user_profile(
            _active_session["username"],
            _active_session["session_cookie"],
            _active_session.get("csrf_token"),
        )
        return ProfileResponse(**profile)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/progress", response_model=ProgressResponse)
async def get_progress():
    """Get user's solve progress per difficulty."""
    if not _active_session:
        raise HTTPException(status_code=401, detail="Not connected to LeetCode.")

    try:
        progress = await graphql_get_user_progress(
            _active_session["username"],
            _active_session["session_cookie"],
            _active_session.get("csrf_token"),
        )
        return ProgressResponse(**progress)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/submissions", response_model=list[SubmissionItem])
async def get_recent_submissions(limit: int = 15):
    """Get recent accepted submissions."""
    if not _active_session:
        raise HTTPException(status_code=401, detail="Not connected to LeetCode.")

    try:
        subs = await graphql_get_recent_submissions(
            _active_session["username"],
            min(limit, 50),
            _active_session["session_cookie"],
            _active_session.get("csrf_token"),
        )
        return [SubmissionItem(**s) for s in subs]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/problems")
async def list_problems(body: ProblemListRequest):
    """Fetch problem list with optional filters. Status filter requires auth."""
    session_cookie = _active_session["session_cookie"] if _active_session else None
    csrf_token = _active_session.get("csrf_token") if _active_session else None

    try:
        result = await graphql_get_problem_list(
            limit=min(body.limit, 50),
            skip=body.skip,
            difficulty=body.difficulty,
            tags=body.tags,
            status=body.status,
            session_cookie=session_cookie,
            csrf_token=csrf_token,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
