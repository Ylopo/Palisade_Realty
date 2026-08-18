"use client"

import { useState, useEffect } from "react"
import { COLLECTIONS_CONFIG } from "@/lib/admin/collectionsConfig"

interface SanityRef {
  _type: "reference"
  _ref: string
}

interface OptionItem {
  _id: string
  label: string
  subtitle?: string
}

interface SingleProps {
  mode: "single"
  refType: string
  value: SanityRef | null | undefined
  onChange: (v: SanityRef | null) => void
  disabled?: boolean
}

interface MultiProps {
  mode: "multi"
  refType: string
  value: SanityRef[] | null | undefined
  onChange: (v: SanityRef[] | null) => void
  disabled?: boolean
}

type Props = SingleProps | MultiProps

export default function ReferenceField(props: Props) {
  const { refType, disabled } = props
  const [options, setOptions] = useState<OptionItem[]>([])
  const [loading, setLoading] = useState(true)

  const cfg = COLLECTIONS_CONFIG[refType]
  const titleField = cfg?.cardTitleField ?? "name"
  const subField = cfg?.cardSubtitleField

  useEffect(() => {
    fetch(`/api/admin/collections/${refType}`)
      .then((r) => r.json())
      .then((data: Record<string, unknown>[]) => {
        setOptions(
          data.map((d) => ({
            _id: d._id as string,
            label: String(d[titleField] ?? d._id),
            subtitle: subField ? String(d[subField] ?? "") : undefined,
          }))
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [refType, titleField, subField])

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    background: "white",
    color: "#111827",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "var(--font-body, sans-serif)",
  }

  if (props.mode === "single") {
    const current = props.value?._ref ?? ""
    return (
      <select
        style={selectStyle}
        value={current}
        disabled={disabled || loading}
        onChange={(e) => {
          const val = e.target.value
          props.onChange(val ? { _type: "reference", _ref: val } : null)
        }}
      >
        <option value="">— None —</option>
        {options.map((o) => (
          <option key={o._id} value={o._id}>
            {o.label}{o.subtitle ? ` — ${o.subtitle}` : ""}
          </option>
        ))}
      </select>
    )
  }

  // Multi mode
  const selected = props.value ?? []
  const selectedIds = new Set(selected.map((r) => r._ref))
  const available = options.filter((o) => !selectedIds.has(o._id))

  const onChangeMulti = (props as MultiProps).onChange

  function add(id: string) {
    const next = [...selected, { _type: "reference" as const, _ref: id }]
    onChangeMulti(next.length ? next : null)
  }

  function remove(id: string) {
    const next = selected.filter((r) => r._ref !== id)
    onChangeMulti(next.length ? next : null)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* Pills */}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {selected.map((ref) => {
            const opt = options.find((o) => o._id === ref._ref)
            return (
              <span
                key={ref._ref}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  background: "rgba(88,23,42,0.08)",
                  border: "1px solid rgba(88,23,42,0.2)",
                  borderRadius: "50px",
                  fontSize: "13px",
                  color: "var(--brand, #58172a)",
                }}
              >
                {opt?.label ?? ref._ref}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => remove(ref._ref)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, lineHeight: 1 }}
                >
                  ✕
                </button>
              </span>
            )
          })}
        </div>
      )}

      {/* Add dropdown */}
      {available.length > 0 && (
        <select
          style={{ ...selectStyle, width: "auto", maxWidth: "100%" }}
          value=""
          disabled={disabled || loading}
          onChange={(e) => { if (e.target.value) add(e.target.value) }}
        >
          <option value="">+ Add reference…</option>
          {available.map((o) => (
            <option key={o._id} value={o._id}>
              {o.label}{o.subtitle ? ` — ${o.subtitle}` : ""}
            </option>
          ))}
        </select>
      )}

      {loading && (
        <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Loading options…</p>
      )}
    </div>
  )
}
