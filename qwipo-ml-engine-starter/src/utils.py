import json
from pathlib import Path
import numpy as np

def save_json(obj, path):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, 'w', encoding='utf8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)

def load_json(path):
    with open(path, 'r', encoding='utf8') as f:
        return json.load(f)

def normalize_scores(arr):
    arr = np.array(arr, dtype=float)
    if arr.max() - arr.min() < 1e-9:
        return np.zeros_like(arr)
    return (arr - arr.min()) / (arr.max() - arr.min())
