export function objectToEmpty(obj: Record<string, any>): void {
  for (const key in obj) Object.prototype.hasOwnProperty.call(obj, key) && delete obj[key]
}
