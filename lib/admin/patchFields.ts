export function splitSetUnset(body: Record<string, unknown>) {
  const setFields: Record<string, unknown> = {}
  const unsetFields: string[] = []
  for (const [key, val] of Object.entries(body)) {
    if (val === null) {
      unsetFields.push(key)
    } else {
      setFields[key] = val
    }
  }
  return { setFields, unsetFields }
}
