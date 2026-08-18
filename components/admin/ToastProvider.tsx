"use client"

import { createContext, useContext, useState, useCallback } from "react"

interface Toast {
  id: number
  message: string
  variant: "success" | "error"
}

interface ToastContextValue {
  showToast: (message: string, variant?: "success" | "error") => void
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, variant: "success" | "error" = "success") => {
    const id = Date.now()
    setToasts((t) => [...t, { id, message, variant }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: "12px 18px",
              borderRadius: "8px",
              background: toast.variant === "success" ? "var(--brand, #58172a)" : "#dc2626",
              color: "white",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "var(--font-body, sans-serif)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              animation: "toast-in 0.2s ease",
            }}
          >
            {toast.variant === "success" ? "✓ " : "✕ "}
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes toast-in { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>
    </ToastContext.Provider>
  )
}
