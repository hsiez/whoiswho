// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import styles from '@components/DefaultLayout.module.scss'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WhoisWho',
  description: 'WhoisWho',
  openGraph: {
    images: 'https://intdev-global.s3.us-west-2.amazonaws.com/template-twitter-summary-large.png'
  },
  twitter: {
    card: 'summary_large_image'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
          {children}
      </body>
    </html>
  )
}
