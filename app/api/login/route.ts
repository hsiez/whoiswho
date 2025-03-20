// app/api/login/route.ts
import { NextResponse } from 'next/server'
import { getOAuthClient } from '@/app/lib/oauth-client'
import crypto from 'crypto'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  try {
    const client = await getOAuthClient()
    const { searchParams } = new URL(req.url)
    const handle = searchParams.get('handle') || 'harl3y.bsky.social'
    const state = crypto.randomBytes(32).toString('hex')

    const cookieStore = await cookies()
    cookieStore.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 minutes
      path: '/',
    })

    const url = await client.authorize(handle, { state })

    // Return redirect with state cookie set
    return new NextResponse(null, {
      status: 302,
      headers: {
        'Location': url.toString(),
      },
    })
  } catch (err) {
    console.error('Error handling login:', err)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
