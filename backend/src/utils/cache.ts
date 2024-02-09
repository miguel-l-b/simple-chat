import TCacheValue from "@/types/cache_value"

export default class Cache {
  private static cache: Record<string, any> = {}

  static set<T extends TCacheValue>(table: string, value: T) {
    console.table(this.cache)
    const key = `${table}:${value.id}`
    delete value.id
    this.cache[key] = value
  }

  static get<T extends TCacheValue>(table: string, id: string) {
    const key = `${table}:${id}`
    return {
      id,
      ...this.cache[key]
    } as T
  }

  static clear() {
    this.cache = {}
  }

  static delete(table: string, id: string) {
    console.table(this.cache)
    const key = `${table}:${id}`
    delete this.cache[key]
  }

  static has(table: string, id: string) {
    const key = `${table}:${id}`
    return !!this.cache[key]
  }

  static getAll<T extends TCacheValue>(table: string) {
    const keys = this.getKeys().filter((key) => key.startsWith(table+":"))
    return keys.map((key) => {
      const id = key.split(":")[1]
      return {
        id,
        ...this.cache[key]
      } as T
    })
  }

  static getKeys() {
    return Object.keys(this.cache)
  }

  static getSize() {
    return this.getKeys().length
  }
}
