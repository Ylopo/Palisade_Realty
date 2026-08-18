"use client"

import { useState, useEffect, useCallback } from "react"
import type { CollectionConfig } from "@/lib/admin/collectionsConfig"
import GenericForm from "./GenericForm"
import { useToast } from "./ToastProvider"

interface Props {
  config: CollectionConfig
}

type SanityDoc = Record<string, unknown> & { _id: string; _type: string }

export default function CollectionView({ config }: Props) {
  const { showToast } = useToast()
  const [items, setItems] = useState<SanityDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<SanityDoc | null | "new">(null)
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [showArchived, setShowArchived] = useState(false)

  const singularLabel = config.singularLabel ?? config.label.replace(/s$/, "")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/collections/${config.type}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`)
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to load", "error")
    } finally {
      setLoading(false)
    }
  }, [config.type, showToast])

  useEffect(() => { load() }, [load])

  function openNew() {
    setFormData({})
    setEditing("new")
    setError(null)
  }

  function openEdit(item: SanityDoc) {
    setFormData({ ...item })
    setEditing(item)
    setError(null)
  }

  function closePanel() {
    setEditing(null)
    setFormData({})
    setError(null)
  }

  async function saveDoc() {
    setSaving(true)
    setError(null)
    try {
      const { _id, _type, _rev, _createdAt, _updatedAt, ...payload } = formData as SanityDoc
      void _rev; void _createdAt; void _updatedAt

      let res: Response
      if (editing === "new") {
        res = await fetch(`/api/admin/collections/${config.type}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        const id = (editing as SanityDoc)._id
        res = await fetch(`/api/admin/collections/${config.type}/${id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Save failed")
      }

      showToast(editing === "new" ? `${singularLabel} created` : `${singularLabel} saved`)
      await load()
      closePanel()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed"
      setError(msg)
      showToast(msg, "error")
    } finally {
      setSaving(false)
    }
  }

  async function deleteDoc(item: SanityDoc) {
    if (!confirm(`Delete "${getTitle(item)}"? This cannot be undone.`)) return
    try {
      await fetch(`/api/admin/collections/${config.type}/${item._id}`, { method: "DELETE" })
      showToast(`${singularLabel} deleted`)
      await load()
      if ((editing as SanityDoc)?._id === item._id) closePanel()
    } catch {
      showToast("Delete failed", "error")
    }
  }

  async function toggleArchive(item: SanityDoc) {
    const isArchived = !!item.archived
    try {
      await fetch(`/api/admin/collections/${config.type}/${item._id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ archived: !isArchived }),
      })
      showToast(isArchived ? `${singularLabel} restored` : `${singularLabel} archived`)
      await load()
    } catch {
      showToast("Failed to update", "error")
    }
  }

  function getTitle(item: SanityDoc): string {
    if (config.cardTitleField) return String(item[config.cardTitleField] ?? "(untitled)")
    return String(item._id ?? "")
  }

  function getSubtitle(item: SanityDoc): string {
    if (config.cardSubtitleField) return String(item[config.cardSubtitleField] ?? "")
    return ""
  }

  function getPhoto(item: SanityDoc): string | null {
    if (!config.cardPhotoField) return null
    const imgField = item[config.cardPhotoField] as { url?: string; asset?: { _ref?: string } } | null
    if (!imgField) return null
    if (imgField.url) return imgField.url
    const ref = imgField.asset?._ref
    if (!ref) return null
    const withoutPrefix = ref.replace(/^image-/, "")
    const parts = withoutPrefix.split("-")
    const ext = parts.pop() ?? "jpg"
    const dims = parts.pop() ?? ""
    const hash = parts.join("-")
    return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${hash}-${dims}.${ext}?w=80&h=80&fit=crop`
  }

  function getPhotoFallback(item: SanityDoc): string | null {
    if (!config.cardPhotoField) return null
    const imgField = item[config.cardPhotoField] as { asset?: { _ref?: string } } | null
    if (imgField?.asset?._ref) return null
    const urlKey = `${config.cardPhotoField}Url`
    return (item[urlKey] as string | null) ?? null
  }

  // ── Filtering and grouping ──────────────────────────────────────────────────

  const q = search.toLowerCase().trim()

  const activeItems = items.filter((i) => !config.archivable || !i.archived)
  const archivedItems = config.archivable ? items.filter((i) => !!i.archived) : []

  function applySearch(list: SanityDoc[]) {
    if (!q) return list
    return list.filter((item) => {
      const t = getTitle(item).toLowerCase()
      const s = getSubtitle(item).toLowerCase()
      return t.includes(q) || s.includes(q)
    })
  }

  function groupItems(list: SanityDoc[]): [string, SanityDoc[]][] {
    if (!config.groupByField) return [["", list]]
    const groups: Record<string, SanityDoc[]> = {}
    for (const item of list) {
      const key = String(item[config.groupByField] ?? "")
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }

  const visibleActive = applySearch(activeItems)
  const visibleArchived = applySearch(archivedItems)

  const panelOpen = editing !== null

  return (
    <div style={{ display: "flex", gap: "0", height: "100%" }}>
      {/* List */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
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
              {loading ? "Loading…" : `${activeItems.length} active${archivedItems.length ? ` · ${archivedItems.length} archived` : ""}`}
            </p>
          </div>
          <button
            onClick={openNew}
            style={{
              padding: "8px 18px",
              background: "var(--brand, #58172a)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + New {singularLabel}
          </button>
        </div>

        {/* Search */}
        {items.length > 4 && (
          <div style={{ marginBottom: "12px" }}>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${config.label.toLowerCase()}…`}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "var(--font-body, sans-serif)",
                outline: "none",
              }}
            />
          </div>
        )}

        {loading && <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading…</p>}

        {!loading && visibleActive.length === 0 && !showArchived && (
          <div style={{
            padding: "40px",
            textAlign: "center",
            color: "#9ca3af",
            border: "2px dashed #e5e7eb",
            borderRadius: "12px",
          }}>
            <p style={{ margin: 0, fontSize: "15px" }}>
              {search ? `No results for "${search}"` : `No ${config.label.toLowerCase()} yet.`}
            </p>
            {!search && <p style={{ margin: "8px 0 0", fontSize: "13px" }}>Click "+ New" to add one.</p>}
          </div>
        )}

        {/* Active items */}
        {!loading && visibleActive.length > 0 && renderGroups(groupItems(visibleActive), false)}

        {/* Archived section */}
        {!loading && config.archivable && archivedItems.length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <button
              onClick={() => setShowArchived((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "13px",
                color: "#6b7280",
                fontWeight: 600,
                padding: "0 0 8px",
              }}
            >
              {showArchived ? "▾" : "▸"} Archived ({visibleArchived.length})
            </button>
            {showArchived && renderGroups(groupItems(visibleArchived), true)}
          </div>
        )}
      </div>

      {/* Editor panel */}
      {panelOpen && (
        <>
          <div
            onClick={closePanel}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 40 }}
          />
          <div style={{
            position: "fixed",
            top: 0, right: 0, bottom: 0,
            width: "min(520px, 90vw)",
            background: "white",
            boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "20px 24px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--brand, #58172a)",
            }}>
              <h3 style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 700,
                color: "white",
                fontFamily: "var(--font-display, serif)",
              }}>
                {editing === "new" ? `New ${singularLabel}` : getTitle(editing as SanityDoc)}
              </h3>
              <button
                onClick={closePanel}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "white", cursor: "pointer", padding: "6px 10px", borderRadius: "6px", fontSize: "14px" }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              {error && (
                <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "13px", marginBottom: "16px" }}>
                  {error}
                </div>
              )}
              <GenericForm
                fields={config.fields}
                value={formData}
                onChange={setFormData}
                disabled={saving}
              />
            </div>

            <div style={{ padding: "16px 24px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={closePanel}
                style={{ padding: "8px 18px", fontSize: "14px", border: "1px solid #d1d5db", borderRadius: "8px", background: "white", color: "#374151", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={saveDoc}
                disabled={saving}
                style={{ padding: "8px 22px", fontSize: "14px", fontWeight: 600, background: "var(--brand, #58172a)", color: "white", border: "none", borderRadius: "8px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving…" : editing === "new" ? "Create" : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  // ── Inner render helpers ────────────────────────────────────────────────────

  function renderGroups(groups: [string, SanityDoc[]][], isArchived: boolean) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: config.groupByField ? "20px" : "4px" }}>
        {groups.map(([groupKey, groupItems]) => (
          <div key={groupKey}>
            {config.groupByField && groupKey && (
              <p style={{
                margin: "0 0 6px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#9ca3af",
                fontFamily: "var(--font-label, sans-serif)",
              }}>
                {config.groupLabels?.[groupKey] ?? groupKey}
              </p>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {groupItems.map((item) => renderCard(item, isArchived))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  function renderCard(item: SanityDoc, isArchived: boolean) {
    const photo = getPhoto(item) ?? getPhotoFallback(item)
    const title = getTitle(item)
    const sub = getSubtitle(item)
    const isSelected = (editing as SanityDoc)?._id === item._id

    // Testimonial card layout
    if (config.layout === "testimonial") {
      const rating = item.rating as number | null
      const quote = item.quote as string | null

      return (
        <div
          key={item._id}
          onClick={() => openEdit(item)}
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            border: isSelected ? "1px solid var(--brand, #58172a)" : "1px solid #e5e7eb",
            background: isSelected ? "rgba(88,23,42,0.04)" : isArchived ? "#fafafa" : "white",
            cursor: "pointer",
            transition: "border-color 0.15s",
            opacity: isArchived ? 0.6 : 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {rating && (
                <div style={{ fontSize: "13px", color: "#eab308", marginBottom: "4px" }}>
                  {"★".repeat(Math.min(5, Math.round(rating)))}{"☆".repeat(Math.max(0, 5 - Math.round(rating)))}
                </div>
              )}
              {quote && (
                <p style={{
                  margin: "0 0 6px",
                  fontSize: "13px",
                  color: "#374151",
                  lineHeight: "1.5",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as const,
                }}>
                  &ldquo;{quote}&rdquo;
                </p>
              )}
              <p style={{ margin: 0, fontWeight: 600, fontSize: "13px", color: "#111827" }}>{title}</p>
              {sub && <p style={{ margin: "1px 0 0", fontSize: "12px", color: "#6b7280" }}>{sub}</p>}
            </div>
            {renderActions(item, isArchived)}
          </div>
        </div>
      )
    }

    // Default card layout
    return (
      <div
        key={item._id}
        onClick={() => openEdit(item)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 14px",
          borderRadius: "8px",
          border: isSelected ? "1px solid var(--brand, #58172a)" : "1px solid #e5e7eb",
          background: isSelected ? "rgba(88,23,42,0.04)" : isArchived ? "#fafafa" : "white",
          cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s",
          opacity: isArchived ? 0.6 : 1,
        }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={title}
            style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: "40px", height: "40px", borderRadius: "6px", background: "var(--brand, #58172a)", opacity: 0.12, flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </p>
          {sub && (
            <p style={{ margin: "1px 0 0", fontSize: "12px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {sub}
            </p>
          )}
        </div>
        {renderActions(item, isArchived)}
      </div>
    )
  }

  function renderActions(item: SanityDoc, isArchived: boolean) {
    return (
      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        {config.archivable && (
          <button
            onClick={() => toggleArchive(item)}
            style={{
              padding: "4px 10px",
              fontSize: "12px",
              color: isArchived ? "#16a34a" : "#6b7280",
              border: `1px solid ${isArchived ? "#bbf7d0" : "#d1d5db"}`,
              borderRadius: "6px",
              background: "white",
              cursor: "pointer",
            }}
          >
            {isArchived ? "Restore" : "Archive"}
          </button>
        )}
        {!config.archivable && (
          <button
            onClick={() => deleteDoc(item)}
            style={{ padding: "4px 10px", fontSize: "12px", color: "#ef4444", border: "1px solid #fecaca", borderRadius: "6px", background: "white", cursor: "pointer" }}
          >
            Delete
          </button>
        )}
      </div>
    )
  }
}
