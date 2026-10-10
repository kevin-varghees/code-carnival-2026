
import logging

from fastapi import APIRouter, Depends, HTTPException
from groq import APIConnectionError, APIStatusError, RateLimitError
from groq import APIError

from app.dependencies import get_current_user
from app.models import User
from app.ai_agent.schemas import ChatRequest, ChatResponse
from app.ai_agent.service import generate_reply


logger = logging.getLogger(__name__)

router = APIRouter(tags=["EventEase AI"])


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
) -> ChatResponse:
    try:
        reply = await generate_reply(
            message=request.message.strip(),
            history=request.history,
        )

        return ChatResponse(
            message=reply,
            action="none",
            data=None,
        )

    except RuntimeError as exc:
        logger.error("EventEase AI configuration error: %s", exc)
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured.",
        ) from exc

    except (RateLimitError, APIConnectionError, APIStatusError, APIError) as exc:
        logger.warning(
    "Groq request failed: %s | status=%s | details=%s",
    type(exc).__name__,
    getattr(exc, "status_code", None),
    str(exc),
)
        raise HTTPException(
            status_code=502,
            detail="The AI provider is temporarily unavailable.",
        ) from exc

    except Exception as exc:
        logger.exception("Unexpected EventEase AI error")
        raise HTTPException(
            status_code=500,
            detail="Unable to process the AI request.",
        ) from exc
