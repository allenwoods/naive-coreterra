import json
import os
from typing import Any, Dict, List, Optional
from pathlib import Path


class DataService:
    def __init__(self, data_file: str = "data/mock_data.json"):
        # Get the project root directory (assuming this file is in app/services/)
        current_dir = Path(__file__).parent.parent.parent
        self.data_file = current_dir / data_file
        self._data: Optional[Dict[str, Any]] = None
        self._load_data()

    def _load_data(self):
        """Load data from JSON file"""
        if self.data_file.exists():
            with open(self.data_file, "r", encoding="utf-8") as f:
                self._data = json.load(f)
        else:
            # Initialize with empty structure
            self._data = {
                "users": [],
                "tasks": [],
                "projects": [],
                "shopItems": [],
                "achievements": []
            }
            self._save_data()

    def _save_data(self):
        """Save data to JSON file"""
        # Ensure directory exists
        self.data_file.parent.mkdir(parents=True, exist_ok=True)
        with open(self.data_file, "w", encoding="utf-8") as f:
            json.dump(self._data, f, indent=2, ensure_ascii=False)

    def get_all(self, collection: str) -> List[Dict[str, Any]]:
        """Get all items from a collection"""
        return self._data.get(collection, [])

    def get_by_id(self, collection: str, item_id: Any) -> Optional[Dict[str, Any]]:
        """Get an item by ID from a collection"""
        items = self.get_all(collection)
        # Handle both int and string IDs
        for item in items:
            if item.get("id") == item_id or str(item.get("id")) == str(item_id):
                return item
        return None

    def create(self, collection: str, item: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new item in a collection"""
        if collection not in self._data:
            self._data[collection] = []
        
        # Auto-generate ID if not provided
        if "id" not in item:
            items = self._data[collection]
            if items:
                # Find max ID
                max_id = max(
                    int(i.get("id", 0)) if isinstance(i.get("id"), int) else 0
                    for i in items
                )
                item["id"] = max_id + 1
            else:
                item["id"] = 1
        
        self._data[collection].append(item)
        self._save_data()
        return item

    def update(self, collection: str, item_id: Any, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an item in a collection"""
        items = self.get_all(collection)
        for i, item in enumerate(items):
            if item.get("id") == item_id or str(item.get("id")) == str(item_id):
                updated_item = {**item, **updates}
                self._data[collection][i] = updated_item
                self._save_data()
                return updated_item
        return None

    def delete(self, collection: str, item_id: Any) -> bool:
        """Delete an item from a collection"""
        items = self.get_all(collection)
        for i, item in enumerate(items):
            if item.get("id") == item_id or str(item.get("id")) == str(item_id):
                self._data[collection].pop(i)
                self._save_data()
                return True
        return False

    def filter(self, collection: str, predicate: callable) -> List[Dict[str, Any]]:
        """Filter items in a collection"""
        items = self.get_all(collection)
        return [item for item in items if predicate(item)]


# Global instance
data_service = DataService()

