import secrets

# Excludes look-alike characters (0/O, 1/I) so codes are easy to read aloud or type.
_EVENT_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def generate_unique_registration_token() -> str:
    """Cryptographically secure, URL-safe token used as the ticket's QR payload."""
    return secrets.token_urlsafe(24)


def generate_event_code(length: int = 6) -> str:
    """Short, human-friendly event code. Uniqueness is enforced by the caller/DB."""
    return "".join(secrets.choice(_EVENT_CODE_ALPHABET) for _ in range(length))
