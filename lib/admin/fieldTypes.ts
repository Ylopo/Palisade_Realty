export type AdminFieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "date"
  | "slug"
  | "image"
  | "file"
  | "reference"
  | "referenceArray"
  | "stringArray"
  | "newlineList"
  | "repeater"
  | "object"
  | "geopoint"
  | "json"
  | "readonly"

export interface AdminField {
  key: string
  label: string
  type: AdminFieldType
  required?: boolean
  placeholder?: string
  withAlt?: boolean
  refType?: string
  itemFields?: AdminField[]
  options?: string[]
  hint?: string
  rows?: number
}

export function normalizeSlug(raw: string): string {
  const last = raw.split("/").pop() ?? raw
  return last
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}
