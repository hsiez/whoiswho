// /lib/oauthClient.ts
import { NodeOAuthClient, NodeSavedState, NodeSavedSession } from '@atproto/oauth-client-node'
import { JoseKey } from '@atproto/jwk-jose'

// Minimal in‑memory implementations
const stateStore = {
  async set(key: string, internalState: NodeSavedState): Promise<void> {
    memoryStateStore[key] = internalState
  },
  async get(key: string): Promise<NodeSavedState | undefined> {
    return memoryStateStore[key]
  },
  async del(key: string): Promise<void> {
    delete memoryStateStore[key]
  },
}

const sessionStore = {
  async set(sub: string, session: NodeSavedSession): Promise<void> {
    memorySessionStore[sub] = session
  },
  async get(sub: string): Promise<NodeSavedSession | undefined> {
    return memorySessionStore[sub]
  },
  async del(sub: string): Promise<void> {
    delete memorySessionStore[sub]
  },
}

// Simple in‑memory objects for demonstration; replace with a persistent store as needed.
const memoryStateStore: Record<string, NodeSavedState> = {}
const memorySessionStore: Record<string, NodeSavedSession> = {}

// Optionally, implement a requestLock function if you expect concurrent accesses.
const requestLock = async <T>(key: string, fn: () => T | Promise<T>): Promise<T> => {
    return await fn();
  }
  

export async function getOAuthClient() {
  const client = new NodeOAuthClient({
    // Expose client metadata and endpoints via your Next.js API routes.
    clientMetadata: {
      client_id: `https://localhost:3000/api/client-metadata.json`,
      redirect_uris: [`http://127.0.0.1:3000/api/callback`],
      client_name: 'WhoisWho',
      client_uri: `http://localhost:3000`,
      logo_uri: `http://localhost:3000/logo.png`,
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      application_type: 'web',
      scope: 'atproto',
      token_endpoint_auth_signing_alg: 'ES256',
      token_endpoint_auth_method: 'private_key_jwt',
      dpop_bound_access_tokens: true,
      jwks_uri: `http://localhost:3000/jwks.json`,
    },
    // Load your private keys from environment variables.
    keyset: await Promise.all([
      JoseKey.fromImportable(process.env.PRIVATE_KEY_1!),
      JoseKey.fromImportable(process.env.PRIVATE_KEY_2!),
      JoseKey.fromImportable(process.env.PRIVATE_KEY_3!),
    ]),
    stateStore,
    sessionStore,
  })
  return client
}
