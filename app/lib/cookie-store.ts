import { cookies } from 'next/headers'
import { NodeSavedState, NodeSavedSession } from '@atproto/oauth-client-node'

// Cookie store implementation
export const createStateStore = async () => {
  const cookieStore = await cookies()

  return {
    async set(key: string, internalState: NodeSavedState): Promise<void> {
      await cookieStore.set(`state-${key}`, JSON.stringify(internalState), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    },
    async get(key: string): Promise<NodeSavedState | undefined> {
      const cookieValue = await cookieStore.get(`state-${key}`)
      if (!cookieValue) return undefined
      try {
        return JSON.parse(cookieValue.value) as NodeSavedState
      } catch (e) {
        console.error('Error parsing cookie:', e)
        return undefined
      }
    },
    async del(key: string): Promise<void> {
      await cookieStore.delete(`state-${key}`)
    }
  }
}

export const createSessionStore = async () => {
  const cookieStore = await cookies()

  return {
    async set(sub: string, session: NodeSavedSession): Promise<void> {
      await cookieStore.set(`session-${sub}`, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    },
    async get(sub: string): Promise<NodeSavedSession | undefined> {
      const cookieValue = await cookieStore.get(`session-${sub}`)
      if (!cookieValue) return undefined
      try {
        return JSON.parse(cookieValue.value) as NodeSavedSession
      } catch (e) {
        console.error('Error parsing cookie:', e)
        return undefined
      }
    },
    async del(sub: string): Promise<void> {
      await cookieStore.delete(`session-${sub}`)
    }
  }
}
