import { getOAuthClient } from "@/app/lib/oauth-client"

export async function GET() {
  const client = await getOAuthClient()
  const response = Response.json(client.jwks, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(response)
  return response
}