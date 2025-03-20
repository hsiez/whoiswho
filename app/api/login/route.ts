import { NextResponse } from 'next/server'
import { getOAuthClient } from '@/app/lib/oauth-client'
import crypto from 'crypto'

export async function GET(req: Request) {
  try {
    const client = await getOAuthClient()
    const { searchParams } = new URL(req.url)
    const handle = searchParams.get('handle') || 'harl3y.bsky.social'
    const state = crypto.randomBytes(32).toString('hex')

    const url = await client.authorize(handle, {
      state,
      // Only supported if OAuth server is openid-compliant
      ui_locales: 'fr-CA fr en',
    })

    return NextResponse.redirect(url.toString())
  } catch (err) {
    console.error('Error handling login:', err)
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
