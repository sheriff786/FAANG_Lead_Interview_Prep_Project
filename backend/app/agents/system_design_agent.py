from app.agents.base_agent import BaseAgent
from app.prompt_pkg import SystemDesignPrompts


class SystemDesignAgent(BaseAgent):
    name = "System Design Coach"
    abbreviation = "SD"

    def build_system_prompt(self, level_str: str) -> str:
        return SystemDesignPrompts.system(level_str)

    def build_user_prompt(self, context: dict) -> str:
        return SystemDesignPrompts.user(
            topic=context.get("topic", ""),
        )
