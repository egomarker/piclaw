interface CollectionLike {
  get(key: unknown): unknown;
  has(key: unknown): boolean;
  set(key: unknown, value: unknown): unknown;
}

interface CollectionUpsertPrototype extends CollectionLike {
  getOrInsert?: (key: unknown, value: unknown) => unknown;
  getOrInsertComputed?: (key: unknown, callbackfn: (key: unknown) => unknown) => unknown;
}

interface CollectionConstructor {
  new(): CollectionLike;
  prototype: CollectionUpsertPrototype;
}

function methodWorks(
  Collection: CollectionConstructor,
  name: "getOrInsert" | "getOrInsertComputed",
  computed: boolean,
): boolean {
  const prototype = Collection.prototype;
  const method = prototype[name];
  if (typeof method !== "function") return false;

  try {
    const collection = new Collection();
    const key = Collection === (WeakMap as unknown as CollectionConstructor) ? {} : "__piclaw_pdfjs_probe__";
    const marker = {};
    const value = computed
      ? method.call(collection, key, () => marker)
      : method.call(collection, key, marker);
    return value === marker && prototype.get.call(collection, key) === marker;
  } catch (error) {
    console.warn(`[pdf-viewer] Replacing broken ${name} implementation.`, error);
    return false;
  }
}

function installCollectionUpsertCompatibility(Collection: CollectionConstructor): void {
  const prototype = Collection.prototype;
  const nativeGet = prototype.get;
  const nativeHas = prototype.has;
  const nativeSet = prototype.set;

  if (!methodWorks(Collection, "getOrInsertComputed", true)) {
    Object.defineProperty(prototype, "getOrInsertComputed", {
      configurable: true,
      writable: true,
      value(this: CollectionLike, key: unknown, callbackfn: (key: unknown) => unknown): unknown {
        const hasKey = nativeHas.call(this, key);
        if (typeof callbackfn !== "function") throw new TypeError("callbackfn must be callable");
        if (hasKey) return nativeGet.call(this, key);
        const value = callbackfn(key);
        nativeSet.call(this, key, value);
        return value;
      },
    });
  }

  if (!methodWorks(Collection, "getOrInsert", false)) {
    Object.defineProperty(prototype, "getOrInsert", {
      configurable: true,
      writable: true,
      value(this: CollectionLike, key: unknown, value: unknown): unknown {
        if (nativeHas.call(this, key)) return nativeGet.call(this, key);
        nativeSet.call(this, key, value);
        return value;
      },
    });
  }
}

export function installPdfJsCollectionCompatibility(): void {
  installCollectionUpsertCompatibility(Map as unknown as CollectionConstructor);
  installCollectionUpsertCompatibility(WeakMap as unknown as CollectionConstructor);
}

installPdfJsCollectionCompatibility();
