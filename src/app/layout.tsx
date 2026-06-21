import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider/AuthProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'LockIn',
  description: 'A minimalist, high-accountability daily task engine.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
