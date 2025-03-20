import { NodeOAuthClientOptions } from '@atproto/oauth-client-node'
import { loadKeyset } from "./auth"
import { createStateStore, createSessionStore } from './cookie-store'

async function loadOAuthConfig() {
  const keyset = await loadKeyset()
  const stateStore = await createStateStore()
  const sessionStore = await createSessionStore()

  return {
    clientMetadata: {
      client_id: `https://localhost:3000/api/client-metadata.json`,
      redirect_uris: [`https://127.0.0.1:3000/api/callback`],

      client_name: 'WhoisWho',
      client_uri:`https://127.0.0.1:3000`,
      logo_uri: `https://127.0.0.1:3000/logo.png`,
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
      application_type: 'web',
      token_endpoint_auth_method: 'private_key_jwt',
      dpop_bound_access_tokens: true,
      jwks_uri: `https://127.0.0.1:3000/jwks.json`,
      scope: 'atproto'

      // ... rest of your metadata
    },
    keyset,
    stateStore,
    sessionStore
  } as NodeOAuthClientOptions
}

export const loadOAuthConfigAsync = loadOAuthConfig
