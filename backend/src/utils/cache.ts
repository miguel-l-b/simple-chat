import TCacheValue from "@/types/cache_value"

export default class Cache {
  private static cache: Record<string, any> = {}

  private static log() {
    const data = {}

    for(const key in this.cache) {
      const [ table, id ] = key.split(":")
      data[id] = {
        table,
        value: JSON.stringify(this.cache[key]).substring(0, 50)+" ...}"
      }
    }
    console.table(data)
  }

  static set<T extends TCacheValue>(table: string, value: T) {
    const key = `${table}:${value.id}`
    delete value.id
    this.cache = {
      ...this.cache,
      [key]: value
    }
    // this.log()
    return {
      id: key.split(":")[1],
      ...value
    } as T
  }

  static update<T extends TCacheValue>(table: string, id: string, value: Partial<T>) {
    const key = `${table}:${id}`
    if(!this.cache[key]) return null
    this.cache[key] = {
      ...this.cache[key],
      ...value
    }
    // this.log()
    return {
      id,
      ...this.cache[key]
    } as T
  }

  static get<T extends TCacheValue>(table: string, id: string) {
    const value = this.cache[`${table}:${id}`]
    if(!value) return null
    return {
      id,
      ...value
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
