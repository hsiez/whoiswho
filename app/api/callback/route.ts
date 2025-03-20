// app/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getOAuthClient } from '@/app/lib/oauth-client'
import { Agent } from '@atproto/api'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const client = await getOAuthClient()
    const params = new URLSearchParams(req.url.split('?')[1])
    
    // Retrieve state from cookie
    const cookieStore = await cookies()
    const storedState = cookieStore.get('oauth_state')?.value
    const incomingState = params.get('state')

    // Validate state matches
    if (incomingState !== storedState) {
      return NextResponse.json(
        { error: 'Invalid state parameter' },
        { status: 400 }
      )
    }

    // Process callback with validated state
    const { session } = await client.callback(params)
    console.log('User authenticated as:', session.did)

    const agent = new Agent(session)
    const profile = await agent.getProfile({ actor: agent.did || '' })
    
    return NextResponse.json({ ok: true, profile: profile.data })
  } catch (err) {
    console.error('Error handling OAuth callback:', err)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
