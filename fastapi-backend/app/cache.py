import os
import json
import hashlib
from typing import Optional

CACHE_FILE = "app/cache_store.json"

def _hash(text: str) -> str:
    """Hash the question text to avoid file size bloating."""
    return hashlib.md5(text.encode("utf-8")).hexdigest()

def load_cache() -> dict:
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    return {}

def save_cache(cache: dict):
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, indent=2)

def get_cached_answer(question: str) -> Optional[str]:
    cache = load_cache()
    return cache.get(_hash(question))

def add_to_cache(question: str, answer: str):
    cache = load_cache()
    question_hash = _hash(question)
    if question_hash not in cache:
        cache[question_hash] = answer
        save_cache(cache)
