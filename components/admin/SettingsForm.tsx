"use client"

import { useState, useEffect, useCallback } from "react"
import type { SettingsConfig } from "@/lib/admin/settingsConfig"
import GenericForm from "./GenericForm"
import { useToast } from "./ToastProvider"

interface Props {
  config: SettingsConfig
}

export default function SettingsForm({ config }: Props) {
  const { showToast } = useToast()
  const [data, setData] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/settings/${config.type}`)
      const json = await res.json()
      setData(json ?? {})
    } catch {
      setError("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }, [config.type])

  useEffect(() => { load() }, [load])

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/settings/${config.type}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Save failed")
      showToast(`${config.label} saved`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed"
      setError(msg)
      showToast(msg, "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "32px", color: "#6b7280", fontSize: "14px" }}>
        Loading {config.label}…
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "28px",
        paddingBottom: "16px",
        borderBottom: "1px solid #e5e7eb",
      }}>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
            fontFamily: "var(--font-display, serif)",
          }}>
            {config.label}
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
            Saved to Sanity • visible immediately after saving
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "9px 24px",
            background: "var(--brand, #58172a)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
            transition: "background 0.2s",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div style={{
          padding: "12px 16px",
          background: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          color: "#dc2626",
          fontSize: "14px",
          marginBottom: "20px",
        }}>
          {error}
        </div>
      )}

      <GenericForm
        fields={config.fields}
        value={data}
        onChange={setData}
        disabled={saving}
      />

      {/* Bottom save */}
      <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "9px 24px",
            background: "var(--brand, #58172a)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
