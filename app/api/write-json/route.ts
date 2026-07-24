import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SECRET       = process.env.ADMIN_SECRET
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_REPO  = process.env.GITHUB_REPO || 'Ylopo/Palisade_Realty'

export async function POST(request: NextRequest) {
  if (SECRET && request.headers.get('x-admin-secret') !== SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'GITHUB_TOKEN is not configured in Vercel environment variables.' },
      { status: 500 }
    )
  }

  const rawFile = (request.nextUrl.searchParams.get('file') || '').replace(/[^a-z0-9-]/gi, '')
  if (!rawFile) return NextResponse.json({ ok: false, error: 'Invalid file name' }, { status: 400 })

  const filePath = `data/${rawFile}.json`

  // Read raw text to preserve formatting and validate JSON
  const bodyText = await request.text()
  let bodyStr: string
  try {
    // If the body is already a JSON string, validate it; otherwise stringify
    JSON.parse(bodyText)
    bodyStr = bodyText
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const ghHeaders = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'Palisade-Admin/1.0',
  }
  const apiBase = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`
  const commitMsg = request.nextUrl.searchParams.get('commit') || `Update ${rawFile} via admin`

  try {
    // Get current file SHA (required for updates)
    const getRes  = await fetch(apiBase, { headers: ghHeaders })
    const getJson = await getRes.json()
    if (!getRes.ok && getRes.status !== 404) {
      return NextResponse.json({ ok: false, error: `GitHub GET failed: ${getJson.message}` }, { status: 502 })
    }
    const sha = getJson.sha as string | undefined

    const content = Buffer.from(bodyStr, 'utf8').toString('base64')
    const putBody: Record<string, string> = { message: commitMsg, content }
    if (sha) putBody.sha = sha

    const putRes  = await fetch(apiBase, {
      method: 'PUT', headers: ghHeaders,
      body: JSON.stringify(putBody),
    })
    const putJson = await putRes.json()

    if (putRes.ok) {
      return NextResponse.json({ ok: true, committed: true, pushed: true, commit: putJson.commit?.sha })
    } else {
      return NextResponse.json({ ok: false, committed: false, pushed: false, error: putJson.message }, { status: 502 })
    }
  } catch (e: unknown) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 })
  }
}
