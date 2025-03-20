'use client'

import { useSearchParams } from 'next/navigation'

export default function LoginPage() {


  return (
    <div>
      <a href={`/api/login`}>
        Login with Bluesky
      </a>
    </div>
  )
}
