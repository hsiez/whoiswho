import { getOAuthClient } from "@/app/lib/oauth-client"

export async function GET() {
  const client = await getOAuthClient()
  const response = Response.json(client.clientMetadata, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(response)
  return response
}