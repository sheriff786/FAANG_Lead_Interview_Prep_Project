"""
LeetCode Router — fetch and cache problems from LeetCode.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.problem import ProblemFetch, ProblemOut
from app.services.leetcode_service import get_or_fetch_problem

router = APIRouter(prefix="/api/leetcode", tags=["leetcode"])


@router.post("/fetch", response_model=ProblemOut)
async def fetch_problem(body: ProblemFetch, db: AsyncSession = Depends(get_db)):
    try:
        data = await get_or_fetch_problem(body.slug_or_id, db)
        return ProblemOut(**data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
