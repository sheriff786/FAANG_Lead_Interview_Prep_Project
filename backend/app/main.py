"""
FAANG/MAANG Interview Prep — FastAPI Backend
Multi-Agent LeetCode Coach + System Design Prep
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import leetcode, agents, system_design, youtube
from app.routers import leetcode_auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="FAANG Interview Prep API",
    description="Multi-Agent LeetCode Coach + System Design Prep",
    version="1.0.0",
    lifespan=lifespan,
)

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(leetcode.router)
app.include_router(leetcode_auth.router)
app.include_router(agents.router)
app.include_router(system_design.router)
app.include_router(youtube.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "provider": settings.llm_provider}
