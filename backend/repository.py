"""Repository adapter boundary for dynamic Social module loading."""

class SocialRepositoryUnavailable(RuntimeError):
    """Raised when the host has not injected a repository adapter."""


class SocialRepository:
    def __init__(self, adapter=None):
        self.adapter = adapter

    def require_adapter(self):
        if self.adapter is None:
            raise SocialRepositoryUnavailable("Social repository adapter is not bound by the host")
        return self.adapter
