"use client"

import { useState } from "react"
import type { CSSProperties } from "react"
import { COLLECTIONS_CONFIG } from "@/lib/admin/collectionsConfig"
import { SETTINGS_CONFIG } from "@/lib/admin/settingsConfig"
import CollectionView from "./CollectionView"
import SettingsForm from "./SettingsForm"
import { ToastProvider } from "./ToastProvider"

type NavItem =
  | { kind: "collection"; key: string }
  | { kind: "settings"; key: string }

const COLLECTIONS = Object.entries(COLLECTIONS_CONFIG).filter(([, c]) => !c.hidden)
const SETTINGS = Object.entries(SETTINGS_CONFIG)

// Group settings by their `group` field
const SETTINGS_GROUPS = SETTINGS.reduce<Record<string, [string, (typeof SETTINGS)[0][1]][]>>(
  (acc, entry) => {
    const g = entry[1].group
    if (!acc[g]) acc[g] = []
    acc[g].push(entry)
    return acc
  },
  {}
)

async function logout() {
  await fetch("/api/config-auth/logout", { method: "POST" })
  window.location.href = "/config/login"
}

export default function AdminShell() {
  const [active, setActive] = useState<NavItem>(
    COLLECTIONS.length > 0
      ? { kind: "collection", key: COLLECTIONS[0][0] }
      : { kind: "settings", key: SETTINGS[0]?.[0] ?? "" }
  )

  const sidebarStyle: CSSProperties = {
    width: "220px",
    flexShrink: 0,
    background: "var(--brand, #58172a)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: "100vh",
  }

  const mainStyle: CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: "32px 36px",
    background: "#f9fafb",
    minHeight: "100vh",
  }

  function NavSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
      <div style={{ marginBottom: "4px" }}>
        <p style={{
          margin: "16px 16px 4px",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          fontFamily: "var(--font-label, sans-serif)",
        }}>
          {label}
        </p>
        {children}
      </div>
    )
  }

  function NavButton({ item, label }: { item: NavItem; label: string }) {
    const isActive =
      active.kind === item.kind && active.key === item.key

    return (
      <button
        onClick={() => setActive(item)}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: isActive ? 600 : 400,
          color: isActive ? "#111827" : "rgba(255,255,255,0.82)",
          background: isActive ? "var(--accent, #eeca00)" : "transparent",
          border: "none",
          cursor: "pointer",
          borderRadius: isActive ? "0" : "0",
          transition: "background 0.15s, color 0.15s",
          fontFamily: "var(--font-body, sans-serif)",
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <ToastProvider>
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav style={sidebarStyle}>
        {/* Brand */}
        <div style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          <p style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 700,
            fontFamily: "var(--font-display, serif)",
            color: "white",
            lineHeight: 1.2,
          }}>
            Palisade Realty
          </p>
          <p style={{
            margin: "2px 0 0",
            fontSize: "11px",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-label, sans-serif)",
          }}>
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto", paddingTop: "8px" }}>
          <NavSection label="Content">
            {COLLECTIONS.map(([key, cfg]) => (
              <NavButton
                key={key}
                item={{ kind: "collection", key }}
                label={cfg.label}
              />
            ))}
          </NavSection>

          {Object.entries(SETTINGS_GROUPS).map(([group, entries]) => (
            <NavSection key={group} label={group}>
              {entries.map(([key, cfg]) => (
                <NavButton
                  key={key}
                  item={{ kind: "settings", key }}
                  label={cfg.label}
                />
              ))}
            </NavSection>
          ))}
        </div>

        {/* Footer links */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <a
            href="/studio"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              fontSize: "12px",
              color: "rgba(255,255,255,0.55)",
              textDecoration: "none",
              padding: "6px 0",
            }}
          >
            ↗ Sanity Studio
          </a>
          <button
            onClick={logout}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "6px 0",
              fontSize: "12px",
              color: "rgba(255,255,255,0.55)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={mainStyle}>
        {active.kind === "collection" && COLLECTIONS_CONFIG[active.key] && (
          <CollectionView key={active.key} config={COLLECTIONS_CONFIG[active.key]} />
        )}
        {active.kind === "settings" && SETTINGS_CONFIG[active.key] && (
          <SettingsForm key={active.key} config={SETTINGS_CONFIG[active.key]} />
        )}
      </main>
    </div>
    </ToastProvider>
  )
}
