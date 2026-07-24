import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secret = request.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { type?: string; slug?: string } = {}
  try { body = await request.json() } catch { /* no body */ }

  const { type, slug } = body

  switch (type) {
    case 'post':
      revalidatePath('/blog')
      if (slug) revalidatePath(`/blog/${slug}`)
      break
    case 'agent':
      revalidatePath('/team')
      if (slug) revalidatePath(`/team/${slug}`)
      break
    case 'testimonial':
      revalidatePath('/testimonials')
      revalidatePath('/')
      break
    case 'featuredProperty':
      revalidatePath('/properties')
      if (slug) revalidatePath(`/properties/${slug}`)
      revalidatePath('/')
      break
    default:
      revalidatePath('/', 'layout')
  }

  return NextResponse.json({ revalidated: true, type, slug })
}
