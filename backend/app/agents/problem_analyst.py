from app.agents.base_agent import BaseAgent
from app.prompt_pkg import ProblemAnalystPrompts


class ProblemAnalystAgent(BaseAgent):
    name = "Problem Analyst"
    abbreviation = "PA"

    def build_system_prompt(self, level_str: str) -> str:
        return ProblemAnalystPrompts.system(level_str)

    def build_user_prompt(self, context: dict) -> str:
        return ProblemAnalystPrompts.user(
            problem_text=context.get("problem_text", ""),
            difficulty=context.get("difficulty", "medium"),
        )
