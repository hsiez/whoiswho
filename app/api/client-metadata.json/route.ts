import { getOAuthClient } from "@/app/lib/oauth-client"

export async function GET() {
  console.log('GET')
  const client = await getOAuthClient()
  console.log(client.clientMetadata)
  const response = Response.json(client.clientMetadata, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  console.log(response)
  return response
}