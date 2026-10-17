/** FNV-1a (32-bit) over the documents' ids and texts; identical in Node and the browser. */
export function contentHash(documents: ReadonlyArray<{ id: string; embeddingText: string }>): string {
  let hash = 0x811c9dc5
  for (const { id, embeddingText } of documents) {
    for (const char of `${id}\u0000${embeddingText}\u0001`) {
      hash ^= char.codePointAt(0)!
      hash = Math.imul(hash, 0x01000193) >>> 0
    }
  }
  return hash.toString(16).padStart(8, '0')
}
