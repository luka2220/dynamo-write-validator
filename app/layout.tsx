import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'DynamoDB Schema Validation Proxy',
  description:
    'Real-time validation logs and schema management for DynamoDB operations',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />

        <main className="pt-16 min-h-screen">{children}</main>
      </body>
    </html>
  )
}
