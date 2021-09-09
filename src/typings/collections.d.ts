declare module "collections/sorted-array-map" {
  export default class SortedArrayMap<K, V> {
    get(key: K): V
    set(key: K, value: V): void
    values(): V[]
    entries(): [K, V][]
    map<T>(callback: ([key, value]: [K, V]) => T): T[]
  }
}
