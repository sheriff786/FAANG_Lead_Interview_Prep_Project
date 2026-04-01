from pydantic import BaseModel
from datetime import datetime


class ProblemFetch(BaseModel):
    slug_or_id: str


class ProblemOut(BaseModel):
    leetcode_id: int | None = None
    title: str
    slug: str
    difficulty: str
    content: str
    tags: list[str] = []


class AnalysisRequest(BaseModel):
    slug_or_id: str | None = None
    manual_description: str | None = None
    difficulty: str = "medium"
    level: str = "intermediate"


class AgentResponse(BaseModel):
    agent: str
    content: str


class FullAnalysisOut(BaseModel):
    problem: ProblemOut | None = None
    analysis: AgentResponse
    strategy: AgentResponse
    code: AgentResponse
    resources: AgentResponse
    detected_pattern: str
    similar_problems: list[dict]
    youtube_links: list[dict]


class FollowUpRequest(BaseModel):
    session_id: str
    message: str
    context: str = ""
    level: str = "intermediate"


class FollowUpResponse(BaseModel):
    reply: str
