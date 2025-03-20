import { NextRequest, NextResponse } from 'next/server'
import { getOAuthClient } from '@/app/lib/oauth-client'
import { Agent } from '@atproto/api'

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const client = await getOAuthClient()
        const params = new URLSearchParams(req.url.split('?')[1])
    
        const { session, state } = await client.callback(params)
    
        // Process successful authentication here
        console.log('authorize() was called with state:', state)
    
        console.log('User authenticated as:', session.did)
    
        const agent = new Agent(session)
    
        // Make Authenticated API calls
        const profile = await agent.getProfile({ actor: agent.did || '' })
        console.log('Bsky profile:', profile.data)
    
        return NextResponse.json({ ok: true })
    } catch (err) {
        console.error('Error handling OAuth callback:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

