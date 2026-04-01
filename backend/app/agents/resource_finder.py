from app.agents.base_agent import BaseAgent
from app.prompt_pkg import ResourceFinderPrompts


class ResourceFinderAgent(BaseAgent):
    name = "Resource Finder"
    abbreviation = "RF"

    def build_system_prompt(self, level_str: str) -> str:
        return ResourceFinderPrompts.system(level_str)

    def build_user_prompt(self, context: dict) -> str:
        return ResourceFinderPrompts.user(
            problem_text=context.get("problem_text", ""),
            strategy_text=context.get("strategy_text", ""),
        )
