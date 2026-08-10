/**
 * Sanity's CDN (which the public marketing pages read through) lags writes by
 * a few seconds. Revalidating a Next.js page immediately after a write can
 * therefore re-render — and re-cache for an hour — the STALE content. Poll
 * until the CDN reflects the write (or the timeout passes) before revalidating.
 */
export async function waitForCdn(check: () => Promise<boolean>, timeoutMs = 20000): Promise<boolean> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      if (await check()) return true
    } catch {
      // transient fetch error — keep polling
    }
    await new Promise((r) => setTimeout(r, 1500))
  }
  return false
}
