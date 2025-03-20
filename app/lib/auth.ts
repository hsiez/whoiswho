import crypto from 'crypto'
import { JoseKey } from '@atproto/jwk-jose'

export async function loadKeyset() {
  return Promise.all([
    JoseKey.fromImportable(
      crypto.createPrivateKey(process.env.PRIVATE_KEY_1!)
    ),
    JoseKey.fromImportable(
      crypto.createPrivateKey(process.env.PRIVATE_KEY_2!)
    ),
    JoseKey.fromImportable(
      crypto.createPrivateKey(process.env.PRIVATE_KEY_3!)
    )
  ])
}