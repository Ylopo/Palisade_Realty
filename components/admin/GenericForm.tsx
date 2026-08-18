"use client"

import { useRef } from "react"
import type { CSSProperties } from "react"
import type { AdminField } from "@/lib/admin/fieldTypes"
import { normalizeSlug } from "@/lib/admin/fieldTypes"
import ReferenceField from "./ReferenceField"

interface Props {
  fields: AdminField[]
  value: Record<string, unknown>
  onChange: (val: Record<string, unknown>) => void
  disabled?: boolean
}

export default function GenericForm({ fields, value, onChange, disabled }: Props) {
  function set(key: string, val: unknown) {
    onChange({ ...value, [key]: val })
  }
  function clear(key: string) {
    onChange({ ...value, [key]: null })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {fields.map((field) => (
        <FieldRenderer
          key={field.key}
          field={field}
          value={value[field.key]}
          parentValue={value}
          onChange={(v) => (v === null ? clear(field.key) : set(field.key, v))}
          disabled={disabled}
        />
      ))}
    </div>
  )
}

// ── helpers ──────────────────────────────────────────────────────────────────

function assetRefToUrl(ref: string): string {
  const withoutPrefix = ref.replace(/^image-/, "")
  const parts = withoutPrefix.split("-")
  const ext = parts.pop() ?? "jpg"
  const dims = parts.pop() ?? ""
  const hash = parts.join("-")
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}-${dims}.${ext}`
}

async function resizeImageFile(file: File, maxPx = 2000): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  let { width, height } = bitmap
  if (width > maxPx || height > maxPx) {
    const ratio = Math.min(maxPx / width, maxPx / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")!
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.85)
  )
}

// ── Per-field renderer ────────────────────────────────────────────────────────

interface FieldProps {
  field: AdminField
  value: unknown
  parentValue?: Record<string, unknown>
  onChange: (v: unknown) => void
  disabled?: boolean
}

function FieldRenderer({ field, value, parentValue, onChange, disabled }: FieldProps) {
  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    lineHeight: "1.5",
    outline: "none",
    background: disabled ? "#f9fafb" : "#fff",
    color: "#111827",
    fontFamily: "var(--font-body, sans-serif)",
  }

  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
    fontFamily: "var(--font-label, var(--font-body, sans-serif))",
  }

  const hintStyle: CSSProperties = {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  }

  function wrap(input: React.ReactNode) {
    return (
      <div>
        <label style={labelStyle}>
          {field.label}
          {field.required && <span style={{ color: "var(--brand, #58172a)", marginLeft: "3px" }}>*</span>}
        </label>
        {input}
        {field.hint && <p style={hintStyle}>{field.hint}</p>}
      </div>
    )
  }

  const str = value as string | undefined | null
  const num = value as number | undefined | null
  const bool = value as boolean | undefined | null

  switch (field.type) {
    case "text":
      return wrap(
        <input
          type="text"
          style={inputStyle}
          value={str ?? ""}
          disabled={disabled}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value || null)}
        />
      )

    case "textarea":
      return wrap(
        <textarea
          style={{ ...inputStyle, resize: "vertical", minHeight: `${(field.rows ?? 4) * 24}px` }}
          value={str ?? ""}
          disabled={disabled}
          placeholder={field.placeholder}
          rows={field.rows ?? 4}
          onChange={(e) => onChange(e.target.value || null)}
        />
      )

    case "number":
      return wrap(
        <input
          type="number"
          style={{ ...inputStyle, width: "160px" }}
          value={num ?? ""}
          disabled={disabled}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      )

    case "boolean":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            id={`field-${field.key}`}
            checked={bool ?? false}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            style={{ width: "16px", height: "16px", accentColor: "var(--brand, #58172a)", cursor: "pointer" }}
          />
          <label htmlFor={`field-${field.key}`} style={{ ...labelStyle, margin: 0, cursor: "pointer" }}>
            {field.label}
          </label>
          {field.hint && <span style={hintStyle}>— {field.hint}</span>}
        </div>
      )

    case "date":
      return wrap(
        <input
          type="date"
          style={{ ...inputStyle, width: "200px" }}
          value={str ? str.slice(0, 10) : ""}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value || null)}
        />
      )

    case "slug": {
      // Sanity stores slugs as { _type: "slug", current: "value" } objects.
      // Support both that format and bare strings (from new docs created by this admin).
      const slugCurrent = typeof value === "object" && value !== null
        ? ((value as Record<string, unknown>).current as string | undefined) ?? ""
        : (str ?? "")
      return wrap(
        <input
          type="text"
          style={inputStyle}
          value={slugCurrent}
          disabled={disabled}
          placeholder={field.placeholder ?? "url-slug-here"}
          onChange={(e) => {
            const norm = normalizeSlug(e.target.value)
            onChange(norm ? { _type: "slug", current: norm } : null)
          }}
        />
      )
    }

    case "readonly":
      return wrap(
        <p style={{ ...inputStyle, background: "#f3f4f6", color: "#6b7280", cursor: "not-allowed" }}>
          {str ?? "(not set)"}
        </p>
      )

    case "image":
      return wrap(
        <ImageField
          field={field}
          value={value}
          parentValue={parentValue}
          onChange={onChange}
          disabled={disabled}
        />
      )

    case "file":
      return wrap(<FileField field={field} value={value} onChange={onChange} disabled={disabled} />)

    case "geopoint":
      return wrap(<GeopointField value={value} onChange={onChange} disabled={disabled} />)

    case "reference":
      return wrap(
        <ReferenceField
          mode="single"
          refType={field.refType ?? ""}
          value={value as { _type: "reference"; _ref: string } | null}
          onChange={onChange}
          disabled={disabled}
        />
      )

    case "referenceArray":
      return wrap(
        <ReferenceField
          mode="multi"
          refType={field.refType ?? ""}
          value={value as { _type: "reference"; _ref: string }[] | null}
          onChange={onChange}
          disabled={disabled}
        />
      )

    case "stringArray":
      return wrap(<StringArrayField value={value as string[] | null} onChange={onChange} disabled={disabled} placeholder={field.placeholder} />)

    case "newlineList":
      return wrap(
        <textarea
          style={{ ...inputStyle, minHeight: "100px" }}
          value={Array.isArray(value) ? (value as string[]).join("\n") : (str ?? "")}
          disabled={disabled}
          placeholder="One item per line"
          onChange={(e) => {
            const lines = e.target.value.split("\n").filter(Boolean)
            onChange(lines.length ? lines : null)
          }}
        />
      )

    case "object":
      return wrap(
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", background: "#fafafa" }}>
          <GenericForm
            fields={field.itemFields ?? []}
            value={(value as Record<string, unknown>) ?? {}}
            onChange={onChange}
            disabled={disabled}
          />
        </div>
      )

    case "repeater":
      return wrap(
        <RepeaterField
          field={field}
          value={value as Record<string, unknown>[] | null}
          onChange={onChange}
          disabled={disabled}
        />
      )

    case "json":
      return wrap(
        <textarea
          style={{ ...inputStyle, minHeight: "120px", fontFamily: "monospace", fontSize: "12px" }}
          value={value != null ? JSON.stringify(value, null, 2) : ""}
          disabled={disabled}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value))
            } catch {
              // invalid JSON — leave as-is until user finishes editing
            }
          }}
        />
      )

    default:
      return wrap(
        <input
          type="text"
          style={inputStyle}
          value={str ?? ""}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value || null)}
        />
      )
  }
}

// ── ImageField ────────────────────────────────────────────────────────────────

interface ImageFieldProps extends FieldProps {
  parentValue?: Record<string, unknown>
}

function ImageField({ field, value, parentValue, onChange, disabled }: ImageFieldProps) {
  const ref = useRef<HTMLInputElement>(null)

  const imageVal = value as { asset?: { _ref?: string }; url?: string } | null | undefined
  const assetRef = imageVal?.asset?._ref

  // Reconstruct CDN URL from Sanity asset ref, or use url if already present
  let sanityUrl: string | null = imageVal?.url ?? (assetRef ? assetRefToUrl(assetRef) : null)

  // ${field.key}Url fallback: show a string URL from a sibling field when no asset is set
  const fallbackUrl = !assetRef && parentValue
    ? (parentValue[`${field.key}Url`] as string | null | undefined) ?? null
    : null

  const previewUrl = sanityUrl ?? fallbackUrl

  async function handleFile(file: File) {
    let blob: Blob
    try {
      blob = await resizeImageFile(file)
    } catch {
      blob = file
    }

    const res = await fetch("/api/admin/upload-image", {
      method: "POST",
      headers: {
        "content-type": "image/jpeg",
        "x-filename": file.name.replace(/\.[^.]+$/, ".jpg"),
      },
      body: blob,
    })
    if (!res.ok) return alert("Upload failed")
    const data = await res.json()
    onChange(data)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {previewUrl && (
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={field.label}
            style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e5e7eb" }}
          />
          {fallbackUrl && !sanityUrl && (
            <span style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: "10px", background: "rgba(0,0,0,0.55)", color: "white", padding: "2px 5px", borderRadius: "3px" }}>
              URL preview
            </span>
          )}
        </div>
      )}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => ref.current?.click()}
          style={{
            padding: "6px 14px",
            fontSize: "13px",
            border: "1px solid var(--brand, #58172a)",
            borderRadius: "6px",
            color: "var(--brand, #58172a)",
            background: "white",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {previewUrl ? "Replace" : "Upload"} Image
        </button>
        {assetRef && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(null)}
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              color: "#6b7280",
              background: "white",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            Remove
          </button>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>
    </div>
  )
}

// ── StringArrayField ──────────────────────────────────────────────────────────

interface SAFProps {
  value: string[] | null
  onChange: (v: string[] | null) => void
  disabled?: boolean
  placeholder?: string
}

function StringArrayField({ value, onChange, disabled, placeholder }: SAFProps) {
  const items = value ?? []

  function update(idx: number, v: string) {
    const next = [...items]
    next[idx] = v
    onChange(next.filter(Boolean).length ? next : null)
  }

  function remove(idx: number) {
    const next = items.filter((_, i) => i !== idx)
    onChange(next.length ? next : null)
  }

  function add() {
    onChange([...items, ""])
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <input
            type="text"
            value={item}
            disabled={disabled}
            placeholder={placeholder ?? ""}
            onChange={(e) => update(i, e.target.value)}
            style={{
              flex: 1,
              padding: "7px 10px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "14px",
              fontFamily: "var(--font-body, sans-serif)",
            }}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => remove(i)}
            style={{ padding: "6px 10px", color: "#ef4444", border: "1px solid #fca5a5", borderRadius: "6px", background: "white", cursor: "pointer", fontSize: "13px" }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={add}
        style={{
          alignSelf: "flex-start",
          padding: "5px 12px",
          fontSize: "13px",
          border: "1px dashed var(--brand, #58172a)",
          borderRadius: "6px",
          color: "var(--brand, #58172a)",
          background: "transparent",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        + Add
      </button>
    </div>
  )
}

// ── FileField ────────────────────────────────────────────────────────────────

function FileField({ field, value, onChange, disabled }: FieldProps) {
  const ref = useRef<HTMLInputElement>(null)

  const fileVal = value as { asset?: { _ref?: string }; url?: string } | null | undefined
  const fileUrl = fileVal?.url ?? null
  const hasFile = !!fileVal?.asset?._ref || !!fileUrl

  async function handleFile(file: File) {
    const res = await fetch("/api/admin/upload-file", {
      method: "POST",
      headers: {
        "content-type": file.type || "application/octet-stream",
        "x-filename": file.name,
      },
      body: file,
    })
    if (!res.ok) return alert("Upload failed")
    const data = await res.json()
    onChange(data)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {hasFile && fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "var(--brand, #58172a)",
            textDecoration: "none",
          }}
        >
          📄 {fileUrl.split("/").pop() ?? "View file"}
        </a>
      )}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => ref.current?.click()}
          style={{
            padding: "6px 14px",
            fontSize: "13px",
            border: "1px solid var(--brand, #58172a)",
            borderRadius: "6px",
            color: "var(--brand, #58172a)",
            background: "white",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {hasFile ? "Replace" : "Upload"} File
        </button>
        {hasFile && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(null)}
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              color: "#6b7280",
              background: "white",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            Remove
          </button>
        )}
        <input
          ref={ref}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </div>
      {field.hint && (
        <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{field.hint}</p>
      )}
    </div>
  )
}

// ── GeopointField ─────────────────────────────────────────────────────────────

function GeopointField({ value, onChange, disabled }: { value: unknown; onChange: (v: unknown) => void; disabled?: boolean }) {
  const geo = value as { _type?: string; lat?: number; lng?: number } | null | undefined
  const lat = geo?.lat ?? ""
  const lng = geo?.lng ?? ""

  function set(key: "lat" | "lng", raw: string) {
    const num = raw === "" ? undefined : Number(raw)
    const next = { _type: "geopoint" as const, lat: key === "lat" ? num : (geo?.lat), lng: key === "lng" ? num : (geo?.lng) }
    if (next.lat == null && next.lng == null) {
      onChange(null)
    } else {
      onChange(next)
    }
  }

  const numInput: React.CSSProperties = {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    width: "160px",
    fontFamily: "var(--font-body, sans-serif)",
  }

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#6b7280" }}>
        Latitude
        <input
          type="number"
          step="any"
          style={numInput}
          value={lat}
          disabled={disabled}
          placeholder="e.g. 32.7157"
          onChange={(e) => set("lat", e.target.value)}
        />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "#6b7280" }}>
        Longitude
        <input
          type="number"
          step="any"
          style={numInput}
          value={lng}
          disabled={disabled}
          placeholder="e.g. -117.1611"
          onChange={(e) => set("lng", e.target.value)}
        />
      </label>
    </div>
  )
}

// ── RepeaterField ─────────────────────────────────────────────────────────────

interface RepProps {
  field: AdminField
  value: Record<string, unknown>[] | null
  onChange: (v: Record<string, unknown>[] | null) => void
  disabled?: boolean
}

function RepeaterField({ field, value, onChange, disabled }: RepProps) {
  const items = value ?? []

  function updateItem(idx: number, v: Record<string, unknown>) {
    const next = [...items]
    next[idx] = v
    onChange(next)
  }

  function removeItem(idx: number) {
    const next = items.filter((_, i) => i !== idx)
    onChange(next.length ? next : null)
  }

  function addItem() {
    onChange([...items, {}])
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map((item, i) => (
        <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "14px", background: "#fafafa", position: "relative" }}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => removeItem(i)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              padding: "2px 8px",
              fontSize: "12px",
              color: "#ef4444",
              border: "1px solid #fca5a5",
              borderRadius: "4px",
              background: "white",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
          <GenericForm
            fields={field.itemFields ?? []}
            value={item}
            onChange={(v) => updateItem(i, v)}
            disabled={disabled}
          />
        </div>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={addItem}
        style={{
          alignSelf: "flex-start",
          padding: "7px 16px",
          fontSize: "13px",
          border: "1px dashed var(--brand, #58172a)",
          borderRadius: "6px",
          color: "var(--brand, #58172a)",
          background: "transparent",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        + Add {field.label} Entry
      </button>
    </div>
  )
}
