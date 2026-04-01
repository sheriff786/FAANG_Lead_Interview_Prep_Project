import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    problem_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("problems.id"))
    difficulty: Mapped[str] = mapped_column(String(20))
    level: Mapped[str] = mapped_column(String(30))
    llm_provider: Mapped[str] = mapped_column(String(30))

    analysis_text: Mapped[str] = mapped_column(Text, default="")
    strategy_text: Mapped[str] = mapped_column(Text, default="")
    code_text: Mapped[str] = mapped_column(Text, default="")
    resource_text: Mapped[str] = mapped_column(Text, default="")
    detected_pattern: Mapped[str] = mapped_column(String(100), default="")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
