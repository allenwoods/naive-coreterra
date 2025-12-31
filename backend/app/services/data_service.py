import json
import os
from typing import Any, Dict, List, Optional
from pathlib import Path


class DataService:
    def __init__(self, data_dir: str = "data"):
        # Get the project root directory (assuming this file is in app/services/)
        current_dir = Path(__file__).parent.parent.parent
        self.data_dir = current_dir / data_dir
        
        # Map collections to their JSON files
        self._file_map = {
            "users": "mock_users.json",
            "authCredentials": "mock_users.json",
            "tasks": "mock_tasks.json",
            "calendarEvents": "mock_tasks.json",
            "projects": "mock_projects.json",
            "shopItems": "mock_items.json",
            "achievements": "mock_achievements.json",
            "teams": "mock_teams.json",
            "contexts": "mock_contexts.json",
            "scheduledCategories": "mock_contexts.json",
            "reports": "mock_report.json",
        }
        
        # Cache for loaded data
        self._data_cache: Dict[str, Dict[str, Any]] = {}
        # Cache for file modification times
        self._file_mtimes: Dict[str, float] = {}
        self._load_all_data()
        self._cache_file_mtimes()
    
    def _get_file_path(self, collection: str) -> Path:
        """Get the file path for a collection"""
        filename = self._file_map.get(collection)
        if not filename:
            raise ValueError(f"Unknown collection: {collection}")
        return self.data_dir / filename
    
    def _load_file(self, filename: str) -> Dict[str, Any]:
        """Load data from a JSON file"""
        file_path = self.data_dir / filename
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}
    
    def _save_file(self, filename: str, data: Dict[str, Any]):
        """Save data to a JSON file"""
        file_path = self.data_dir / filename
        # Ensure directory exists
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def _load_all_data(self):
        """Load all data files into cache"""
        # Load each unique file once
        loaded_files = {}
        for collection, filename in self._file_map.items():
            if filename not in loaded_files:
                loaded_files[filename] = self._load_file(filename)
            self._data_cache[filename] = loaded_files[filename]
    
    def _cache_file_mtimes(self):
        """Cache modification times of all data files"""
        for filename in set(self._file_map.values()):
            file_path = self.data_dir / filename
            if file_path.exists():
                self._file_mtimes[filename] = os.path.getmtime(file_path)
    
    def _check_and_reload_file(self, filename: str):
        """Check if file has been modified and reload if necessary"""
        file_path = self.data_dir / filename
        if not file_path.exists():
            return
        
        current_mtime = os.path.getmtime(file_path)
        cached_mtime = self._file_mtimes.get(filename)
        
        # 如果文件有改动，重新加载
        if cached_mtime is None or current_mtime > cached_mtime:
            self._data_cache[filename] = self._load_file(filename)
            self._file_mtimes[filename] = current_mtime
    
    def _get_collection_data(self, collection: str) -> List[Dict[str, Any]]:
        """Get the data array for a collection from the appropriate file"""
        filename = self._file_map.get(collection)
        if not filename:
            return []
        
        # 检查文件是否有改动，如果有则自动重新加载
        self._check_and_reload_file(filename)
        
        file_data = self._data_cache.get(filename, {})
        
        # Handle special cases
        if collection == "authCredentials":
            return file_data.get("authCredentials", [])
        elif collection == "calendarEvents":
            return file_data.get("calendarEvents", [])
        elif collection == "teams":
            return file_data.get("teams", [])
        elif collection == "contexts":
            return file_data.get("contexts", [])
        elif collection == "scheduledCategories":
            return file_data.get("scheduledCategories", [])
        elif collection == "reports":
            return file_data.get("reports", [])
        else:
            # Standard collections: users, tasks, projects, shopItems, achievements
            return file_data.get(collection, [])
    
    def _save_collection_data(self, collection: str, data: List[Dict[str, Any]]):
        """Save collection data back to its file"""
        filename = self._file_map.get(collection)
        if not filename:
            raise ValueError(f"Unknown collection: {collection}")
        
        file_data = self._data_cache.get(filename, {})
        
        # Handle special cases
        if collection == "authCredentials":
            file_data["authCredentials"] = data
        elif collection == "calendarEvents":
            file_data["calendarEvents"] = data
        elif collection == "teams":
            file_data["teams"] = data
        elif collection == "contexts":
            file_data["contexts"] = data
        elif collection == "scheduledCategories":
            file_data["scheduledCategories"] = data
        elif collection == "reports":
            file_data["reports"] = data
        else:
            # Standard collections
            file_data[collection] = data
        
        self._data_cache[filename] = file_data
        self._save_file(filename, file_data)
        # 更新文件修改时间缓存
        file_path = self.data_dir / filename
        if file_path.exists():
            self._file_mtimes[filename] = os.path.getmtime(file_path)
    
    def get_all(self, collection: str) -> List[Dict[str, Any]]:
        """Get all items from a collection"""
        return self._get_collection_data(collection)
    
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
        items = self.get_all(collection)
        
        # Auto-generate ID if not provided
        if "id" not in item:
            if items:
                # Find max ID
                max_id = max(
                    int(i.get("id", 0)) if isinstance(i.get("id"), int) else 0
                    for i in items
                )
                item["id"] = max_id + 1
            else:
                item["id"] = 1
        
        items.append(item)
        self._save_collection_data(collection, items)
        return item
    
    def update(self, collection: str, item_id: Any, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an item in a collection"""
        items = self.get_all(collection)
        for i, item in enumerate(items):
            if item.get("id") == item_id or str(item.get("id")) == str(item_id):
                updated_item = {**item, **updates}
                items[i] = updated_item
                self._save_collection_data(collection, items)
                return updated_item
        return None
    
    def delete(self, collection: str, item_id: Any) -> bool:
        """Delete an item from a collection"""
        items = self.get_all(collection)
        for i, item in enumerate(items):
            if item.get("id") == item_id or str(item.get("id")) == str(item_id):
                items.pop(i)
                self._save_collection_data(collection, items)
                return True
        return False
    
    def filter(self, collection: str, predicate: callable) -> List[Dict[str, Any]]:
        """Filter items in a collection"""
        items = self.get_all(collection)
        return [item for item in items if predicate(item)]
    
    def get_auth_credentials(self, username: str) -> Optional[Dict[str, Any]]:
        """Get authentication credentials for a username"""
        credentials = self.get_all("authCredentials")
        for cred in credentials:
            if cred.get("username") == username:
                return cred
        return None


# Global instance
data_service = DataService()
