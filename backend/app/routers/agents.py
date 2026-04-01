"""
Agents Router — orchestrates multi-agent analysis and follow-up chat.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.problem import AnalysisRequest, FullAnalysisOut, AgentResponse, FollowUpRequest, FollowUpResponse
from app.services.leetcode_service import get_or_fetch_problem
from app.services.youtube_service import search_youtube
from app.services.llm_service import invoke_llm
from app.prompt_pkg import FollowUpPrompts
from app.agents.problem_analyst import ProblemAnalystAgent
from app.agents.strategy_coach import StrategyCoachAgent
from app.agents.code_mentor import CodeMentorAgent
from app.agents.resource_finder import ResourceFinderAgent
from app.utils.pattern_detection import detect_pattern, get_similar_problems
from app.models.analysis import Analysis
from app.models.session import ChatMessage

router = APIRouter(prefix="/api/agents", tags=["agents"])


@router.post("/analyze", response_model=FullAnalysisOut)
async def run_analysis(body: AnalysisRequest, db: AsyncSession = Depends(get_db)):
    """Run all 4 agents on a LeetCode problem."""

    # Resolve problem text
    problem_data = None
    problem_text = ""

    if body.slug_or_id:
        try:
            problem_data = await get_or_fetch_problem(body.slug_or_id, db)
            problem_text = (
                f"Problem #{problem_data.get('leetcode_id', '?')}: {problem_data['title']}\n"
                f"Difficulty: {problem_data['difficulty']}\n"
                f"Tags: {', '.join(problem_data.get('tags', []))}\n\n"
                f"Statement:\n{problem_data['content']}"
            )
        except Exception:
            pass

    if not problem_text and body.manual_description:
        problem_text = body.manual_description

    if not problem_text:
        raise HTTPException(status_code=400, detail="No problem provided. Fetch a problem or paste a description.")

    context = {"problem_text": problem_text, "difficulty": body.difficulty}

    # Agent 1 — Problem Analyst
    analyst = ProblemAnalystAgent()
    analysis_text = await analyst.run(context, body.level)
    context["analysis_text"] = analysis_text

    # Agent 2 — Strategy Coach
    strategist = StrategyCoachAgent()
    strategy_text = await strategist.run(context, body.level)
    context["strategy_text"] = strategy_text

    # Agent 3 — Code Mentor
    coder = CodeMentorAgent()
    code_text = await coder.run(context, body.level)

    # Agent 4 — Resource Finder
    finder = ResourceFinderAgent()
    resource_text = await finder.run(context, body.level)

    # Pattern detection & similar problems
    tags_str = ", ".join(problem_data.get("tags", [])) if problem_data else ""
    pattern = detect_pattern(strategy_text, tags_str)
    slug = problem_data["slug"] if problem_data else ""
    similar = get_similar_problems(pattern, slug)

    # YouTube search
    search_query = f"leetcode {problem_data['title'] if problem_data else body.slug_or_id or 'algorithm'} solution explanation"
    try:
        youtube_links = await search_youtube(search_query, max_results=5)
    except Exception:
        youtube_links = []

    # Persist analysis in DB
    if problem_data and problem_data.get("leetcode_id"):
        from sqlalchemy import select
        from app.models.problem import Problem

        stmt = select(Problem).where(Problem.slug == problem_data["slug"])
        result = await db.execute(stmt)
        db_problem = result.scalar_one_or_none()
        if db_problem:
            record = Analysis(
                problem_id=db_problem.id,
                difficulty=body.difficulty,
                level=body.level,
                llm_provider="configured",
                analysis_text=analysis_text,
                strategy_text=strategy_text,
                code_text=code_text,
                resource_text=resource_text,
                detected_pattern=pattern,
            )
            db.add(record)
            await db.commit()

    return FullAnalysisOut(
        problem=problem_data if problem_data else None,
        analysis=AgentResponse(agent="Problem Analyst", content=analysis_text),
        strategy=AgentResponse(agent="Strategy Coach", content=strategy_text),
        code=AgentResponse(agent="Code Mentor", content=code_text),
        resources=AgentResponse(agent="Resource Finder", content=resource_text),
        detected_pattern=pattern,
        similar_problems=similar,
        youtube_links=youtube_links,
    )


@router.post("/followup", response_model=FollowUpResponse)
async def followup_chat(body: FollowUpRequest, db: AsyncSession = Depends(get_db)):
    """Handle follow-up questions about a problem."""
    level_str = FollowUpPrompts.get_level(body.level)
    system_prompt = FollowUpPrompts.system(level_str, body.context)

    reply = await invoke_llm(system_prompt, body.message)

    # Store messages
    msg_user = ChatMessage(session_id=body.session_id, role="user", content=body.message)
    msg_assistant = ChatMessage(session_id=body.session_id, role="assistant", agent="Coach", content=reply)
    db.add(msg_user)
    db.add(msg_assistant)
    await db.commit()

    return FollowUpResponse(reply=reply)
