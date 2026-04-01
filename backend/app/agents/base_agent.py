"""
Base Agent — shared interface for all coaching agents.
"""

from abc import ABC, abstractmethod
from app.services.llm_service import invoke_llm
from app.prompt_pkg import LevelPrompts


class BaseAgent(ABC):
    name: str = "BaseAgent"
    abbreviation: str = "BA"

    @abstractmethod
    def build_system_prompt(self, level_str: str) -> str:
        ...

    @abstractmethod
    def build_user_prompt(self, context: dict) -> str:
        ...

    async def run(self, context: dict, level: str = "intermediate") -> str:
        level_str = LevelPrompts.get(level)

        system_prompt = self.build_system_prompt(level_str)
        user_prompt = self.build_user_prompt(context)
        return await invoke_llm(system_prompt, user_prompt)
