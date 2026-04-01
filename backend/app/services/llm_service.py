"""
LLM Service — abstraction over OpenAI / Anthropic / Google.
Uses LangChain so switching providers is a one-line config change.
"""

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from app.config import get_settings

_llm_instance = None


def _build_llm():
    """Construct the LangChain chat model based on config."""
    settings = get_settings()
    provider = settings.llm_provider.lower()

    if provider == "openai":
        from langchain_openai import ChatOpenAI

        return ChatOpenAI(
            model=settings.openai_model,
            api_key=settings.openai_api_key,
            temperature=0.4,
            max_tokens=2048,
        )
    elif provider == "anthropic":
        from langchain_anthropic import ChatAnthropic

        return ChatAnthropic(
            model=settings.anthropic_model,
            api_key=settings.anthropic_api_key,
            temperature=0.4,
            max_tokens=2048,
        )
    elif provider == "google":
        from langchain_google_genai import ChatGoogleGenerativeAI

        return ChatGoogleGenerativeAI(
            model=settings.google_model,
            google_api_key=settings.google_api_key,
            temperature=0.4,
            max_output_tokens=2048,
        )
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")


def get_llm():
    global _llm_instance
    if _llm_instance is None:
        _llm_instance = _build_llm()
    return _llm_instance


def reset_llm():
    """Call after changing provider at runtime."""
    global _llm_instance
    _llm_instance = None


async def invoke_llm(system_prompt: str, user_prompt: str, history: list[dict] | None = None) -> str:
    """
    Single entry point for all LLM calls.
    history = [{"role": "user"|"assistant", "content": "..."}]
    """
    llm = get_llm()
    messages = [SystemMessage(content=system_prompt)]

    if history:
        for msg in history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))

    messages.append(HumanMessage(content=user_prompt))

    response = await llm.ainvoke(messages)
    return response.content
