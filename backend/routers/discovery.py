from fastapi import APIRouter
from typing import List, Optional
from pydantic import BaseModel
from models.media import Media
from models.collections import Collection
from models.locations import Location
from lib.db import db

router = APIRouter(prefix="/discovery", tags=["discovery"])


class TagFacet(BaseModel):
    name: str
    count: int


class DiscoveryFacets(BaseModel):
    tags: List[TagFacet]
    categories: List[TagFacet]
    locations: List[TagFacet]


class SearchResults(BaseModel):
    query: str
    total: int
    media: List[Media]
    collections: List[Collection]
    locations: List[Location]
    suggested_tags: List[str]


@router.get("/facets", response_model=DiscoveryFacets)
async def get_discovery_facets():
    """Smart tag / category / location facets with live counts for the search palette."""
    docs = await db.media.find({"published": True}).to_list(1000)

    tag_counts: dict[str, int] = {}
    cat_counts: dict[str, int] = {}
    loc_counts: dict[str, int] = {}

    for d in docs:
        for t in d.get("tags", []) or []:
            tag_counts[t] = tag_counts.get(t, 0) + 1
        cat = d.get("category")
        if cat:
            cat_counts[cat] = cat_counts.get(cat, 0) + 1
        loc = d.get("location_name")
        if loc:
            loc_counts[loc] = loc_counts.get(loc, 0) + 1

    def to_facets(counts: dict[str, int], limit: int) -> List[TagFacet]:
        ordered = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:limit]
        return [TagFacet(name=k, count=v) for k, v in ordered]

    return DiscoveryFacets(
        tags=to_facets(tag_counts, 24),
        categories=to_facets(cat_counts, 12),
        locations=to_facets(loc_counts, 12),
    )


@router.get("/search", response_model=SearchResults)
async def universal_search(q: str = "", limit: int = 30):
    """Instant universal search across media, collections and places."""
    query = q.strip()
    if not query:
        return SearchResults(query="", total=0, media=[], collections=[], locations=[], suggested_tags=[])

    rx = {"$regex": query, "$options": "i"}

    media_docs = await db.media.find({
        "published": True,
        "$or": [
            {"title": rx},
            {"description": rx},
            {"short_description": rx},
            {"category": rx},
            {"location_name": rx},
            {"collection_name": rx},
            {"tags": rx},
        ],
    }).limit(limit).to_list(limit)

    col_docs = await db.collections.find({
        "$or": [{"title": rx}, {"description": rx}, {"subtitle": rx}, {"category": rx}, {"location_name": rx}],
    }).limit(10).to_list(10)

    loc_docs = await db.locations.find({
        "$or": [{"place_name": rx}, {"country": rx}, {"region": rx}, {"city": rx}, {"description": rx}],
    }).limit(10).to_list(10)

    # Suggested tags derived from the matched result set
    suggested: dict[str, int] = {}
    for d in media_docs:
        for t in d.get("tags", []) or []:
            suggested[t] = suggested.get(t, 0) + 1
    suggested_tags = [k for k, _ in sorted(suggested.items(), key=lambda kv: -kv[1])][:10]

    return SearchResults(
        query=query,
        total=len(media_docs) + len(col_docs) + len(loc_docs),
        media=[Media(**m) for m in media_docs],
        collections=[Collection(**c) for c in col_docs],
        locations=[Location(**l) for l in loc_docs],
        suggested_tags=suggested_tags,
    )
