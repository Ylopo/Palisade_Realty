import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function isAuthorized(request: NextRequest): boolean {
  const secret = request.nextUrl.searchParams.get('secret')
  return Boolean(secret) && Boolean(process.env.ADMIN_SECRET) && secret === process.env.ADMIN_SECRET
}

// Handles client-side Vercel Blob uploads for video files. The client calls
// upload() from @vercel/blob/client against this URL — the video goes
// directly to Vercel Blob's CDN, bypassing Next.js's request body limit.
export async function POST(request: NextRequest): Promise<Response> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname) => {
        return {
          allowedContentTypes: ['video/*', 'image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('[upload-video] Upload completed:', blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
