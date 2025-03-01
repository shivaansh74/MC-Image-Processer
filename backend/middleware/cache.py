import hashlib
import os
import json
import time
from typing import Dict, Any, Callable, Optional
import functools
from pathlib import Path

class ImageProcessingCache:
    """
    Simple file-based cache for image processing results
    """
    def __init__(self, cache_dir: str = "cache", max_age: int = 86400, max_size: int = 50):
        """
        Initialize the cache
        
        Args:
            cache_dir: Directory to store cache files
            max_age: Maximum age of cache entries in seconds (default: 24 hours)
            max_size: Maximum number of items in the cache
        """
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True, parents=True)
        self.max_age = max_age
        self.max_size = max_size
        self._cleanup_old_entries()
    
    def _generate_key(self, image_data: bytes, params: Dict[str, Any]) -> str:
        """Generate a unique key from image data and processing parameters"""
        # Create a hash of the image data
        image_hash = hashlib.md5(image_data).hexdigest()
        
        # Create a hash of the parameters
        param_str = json.dumps(params, sort_keys=True)
        param_hash = hashlib.md5(param_str.encode()).hexdigest()
        
        # Combine both hashes
        return f"{image_hash}_{param_hash}"
    
    def _cache_path(self, key: str) -> Path:
        """Get the cache file path for a key"""
        return self.cache_dir / f"{key}.json"
    
    def get(self, image_data: bytes, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Get an item from the cache
        
        Args:
            image_data: Raw image data
            params: Processing parameters
            
        Returns:
            Cached result or None if not found or expired
        """
        key = self._generate_key(image_data, params)
        cache_file = self._cache_path(key)
        
        if not cache_file.exists():
            return None
        
        try:
            # Check if file is too old
            mtime = cache_file.stat().st_mtime
            if time.time() - mtime > self.max_age:
                cache_file.unlink()
                return None
            
            with open(cache_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Cache error: {e}")
            return None
    
    def set(self, image_data: bytes, params: Dict[str, Any], result: Dict[str, Any]) -> None:
        """
        Store an item in the cache
        
        Args:
            image_data: Raw image data
            params: Processing parameters
            result: Result to cache
        """
        key = self._generate_key(image_data, params)
        cache_file = self._cache_path(key)
        
        try:
            with open(cache_file, 'w') as f:
                json.dump(result, f)
            
            # Update the access time
            os.utime(cache_file, None)
        except Exception as e:
            print(f"Failed to write cache: {e}")
        
        # Check if we need to clean up
        self._enforce_size_limit()
    
    def _cleanup_old_entries(self) -> None:
        """Remove expired cache entries"""
        current_time = time.time()
        for cache_file in self.cache_dir.glob("*.json"):
            try:
                mtime = cache_file.stat().st_mtime
                if current_time - mtime > self.max_age:
                    cache_file.unlink()
            except Exception as e:
                print(f"Error cleaning cache entry {cache_file}: {e}")
    
    def _enforce_size_limit(self) -> None:
        """Enforce the maximum cache size by removing oldest entries"""
        cache_files = list(self.cache_dir.glob("*.json"))
        
        if len(cache_files) <= self.max_size:
            return
            
        # Sort by last modified time (oldest first)
        cache_files.sort(key=lambda f: f.stat().st_mtime)
        
        # Remove oldest entries until we're under the limit
        for i in range(len(cache_files) - self.max_size):
            try:
                cache_files[i].unlink()
            except Exception as e:
                print(f"Error removing cache entry: {e}")

# Create a decorator for easy use with functions
def cached_image_processing(f: Callable):
    """Decorator to cache image processing results"""
    cache = ImageProcessingCache()
    
    @functools.wraps(f)
    def wrapper(image_data: bytes, *args, **kwargs):
        params = {'args': args, 'kwargs': kwargs}
        cached_result = cache.get(image_data, params)
        
        if cached_result:
            return cached_result
            
        result = f(image_data, *args, **kwargs)
        cache.set(image_data, params, result)
        return result
        
    return wrapper
