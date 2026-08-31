"""Backend coverage for the archive-wide search feature (discovery/search + facets).

Criterion: Archive-wide instant search with smart tag suggestions.
"""


def test_search_mist_returns_media_and_collection(client):
    resp = client.get("/discovery/search", params={"q": "mist"})
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["total"] >= 1
    assert len(data["media"]) >= 1
    collection_titles = [c["title"] for c in data.get("collections", [])]
    assert any("Mist" in t for t in collection_titles), f"expected a Mist collection, got {collection_titles}"


def test_search_gibberish_returns_empty_not_error(client):
    resp = client.get("/discovery/search", params={"q": "zzzqqq"})
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["total"] == 0
    assert data["media"] == []
    assert data["collections"] == []


def test_facets_returns_tag_suggestions(client):
    resp = client.get("/discovery/facets")
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert "tags" in data
    assert len(data["tags"]) > 0
    assert "name" in data["tags"][0] and "count" in data["tags"][0]
