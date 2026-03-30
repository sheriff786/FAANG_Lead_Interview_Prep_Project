import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class SystemDesignTopic(Base):
    __tablename__ = "system_design_topics"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(300), index=True)
    category: Mapped[str] = mapped_column(String(100))  # e.g. "URL Shortener", "Chat System"
    description: Mapped[str] = mapped_column(Text, default="")
    requirements_text: Mapped[str] = mapped_column(Text, default="")
    high_level_design: Mapped[str] = mapped_column(Text, default="")
    deep_dive: Mapped[str] = mapped_column(Text, default="")
    llm_provider: Mapped[str] = mapped_column(String(30), default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
