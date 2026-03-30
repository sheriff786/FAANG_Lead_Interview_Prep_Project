from app.agents.base_agent import BaseAgent
from app.prompt_pkg import CodeMentorPrompts


class CodeMentorAgent(BaseAgent):
    name = "Code Mentor"
    abbreviation = "CM"

    def build_system_prompt(self, level_str: str) -> str:
        return CodeMentorPrompts.system(level_str)

    def build_user_prompt(self, context: dict) -> str:
        return CodeMentorPrompts.user(
            problem_text=context.get("problem_text", ""),
            strategy_text=context.get("strategy_text", ""),
        )
