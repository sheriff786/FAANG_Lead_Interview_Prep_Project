from pydantic import BaseModel


class SystemDesignRequest(BaseModel):
    topic: str
    level: str = "intermediate"


class SystemDesignOut(BaseModel):
    title: str
    category: str
    requirements: str
    high_level_design: str
    deep_dive: str
    youtube_links: list[dict] = []
