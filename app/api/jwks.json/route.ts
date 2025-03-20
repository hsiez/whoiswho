// app/api/auth/route.ts
import { type NextRequest } from 'next/server';
import { getOAuthClient } from '@/app/lib/oauth-client';

export const runtime = 'nodejs'; // Force Node.js runtime

export async function GET(request: NextRequest) {
  try {
    const client = await getOAuthClient();
    const sessionCookie = request.cookies.get('bsky-session')?.value;

    if (!sessionCookie) {
      return new Response(JSON.stringify({ session: false }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const session = await client.restore(sessionCookie);
    return Response.json({ session: !!session });
    
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
