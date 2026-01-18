type CacheRecord<T> = {
  expireAt: number
  value: T
}

export class MemoryCache {
  private store = new Map<string, CacheRecord<any>>()

  get<T>(key: string): T | undefined {
    const record = this.store.get(key)
    if (!record) return undefined
    if (record.expireAt <= Date.now()) {
      this.store.delete(key)
      return undefined
    }
    return record.value as T
  }

  set<T>(key: string, value: T, ttlMs: number) {
    const expireAt = Date.now() + Math.max(0, ttlMs)
    this.store.set(key, { expireAt, value })
  }

  delete(key: string) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }
}

