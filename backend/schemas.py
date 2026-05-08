"""Pydantic schemas for module-local Social APIs."""
from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, Field

Visibility = Literal["public", "followers", "private"]
ReactionType = Literal["like", "insightful", "boost", "love", "laugh"]


class SocialMediaItem(BaseModel):
    media_id: str
    media_type: str
    url: str
    thumbnail_url: str | None = None
    alt_text: str | None = None
    status: str | None = "linked"


class SocialPostCreate(BaseModel):
    body: str = Field(min_length=1, max_length=4000)
    visibility: Visibility = "public"
    media_items: list[SocialMediaItem] = Field(default_factory=list)


class SocialCommentCreate(BaseModel):
    body: str = Field(min_length=1, max_length=2000)


class SocialReactionCreate(BaseModel):
    reaction_type: ReactionType = "like"


class SocialHealthResponse(BaseModel):
    status: str
    module_id: str
    version: str
    backend_contract: str
    canonical_api: str
