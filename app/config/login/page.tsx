"use client"

import { useState, FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/config"

  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/config-auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error ?? "Invalid password")
        return
      }
      // Hard navigation so cookie is present on the next request
      window.location.href = next
    } catch {
      setError("Network error — please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f9fafb",
      fontFamily: "var(--font-body, sans-serif)",
    }}>
      <div style={{
        width: "360px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: "var(--brand, #58172a)",
          padding: "28px 32px 24px",
          textAlign: "center",
        }}>
          <p style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: 700,
            fontFamily: "var(--font-display, serif)",
            color: "white",
            lineHeight: 1.2,
          }}>
            Palisade Realty
          </p>
          <p style={{
            margin: "6px 0 0",
            fontSize: "13px",
            color: "rgba(255,255,255,0.65)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            Admin Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ padding: "28px 32px 32px" }}>
          <label style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 600,
            color: "#374151",
            marginBottom: "8px",
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              border: error ? "1px solid #fca5a5" : "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "var(--font-body, sans-serif)",
              transition: "border-color 0.15s",
            }}
          />

          {error && (
            <p style={{
              margin: "8px 0 0",
              fontSize: "13px",
              color: "#dc2626",
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "11px",
              background: "var(--brand, #58172a)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading || !password ? "not-allowed" : "pointer",
              opacity: loading || !password ? 0.65 : 1,
              transition: "opacity 0.15s",
              fontFamily: "var(--font-body, sans-serif)",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
