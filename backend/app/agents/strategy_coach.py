from app.agents.base_agent import BaseAgent
from app.prompt_pkg import StrategyCoachPrompts


class StrategyCoachAgent(BaseAgent):
    name = "Strategy Coach"
    abbreviation = "SC"

    def build_system_prompt(self, level_str: str) -> str:
        return StrategyCoachPrompts.system(level_str)

    def build_user_prompt(self, context: dict) -> str:
        return StrategyCoachPrompts.user(
            problem_text=context.get("problem_text", ""),
            analysis_text=context.get("analysis_text", ""),
        )
