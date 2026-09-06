interface CacheOptions {
  ttl?: number;
  tags?: string[];
}

class CacheService {
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  async set(key: string, data: any, options: CacheOptions = {}) {
    const ttl = options.ttl || 300;
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl * 1000,
    });
  }

  async invalidate(tag: string) {
    for (const [key] of this.cache) {
      if (key.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new CacheService();
