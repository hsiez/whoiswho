// app/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getOAuthClient } from '@/app/lib/oauth-client'
import { Agent } from '@atproto/api'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const client = await getOAuthClient()
    const params = new URLSearchParams(req.url.split('?')[1])
    const { session, state } = await client.callback(params)

    // Retrieve state from cookie using Next.js cookies() helper
    const cookieStore = await cookies()
    const storedState = cookieStore.get('oauth_state')?.value

    // Validate state exists and matches
    if (!storedState || !state || storedState !== state) {
        console.log('Invalid state parameter')
        console.log(storedState)
        console.log(state)  
      return NextResponse.json(
        { error: 'Invalid state parameter' },
        { status: 400 }
      )
    }

    // Delete the state cookie now that it's used
    cookieStore.delete('oauth_state')

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
