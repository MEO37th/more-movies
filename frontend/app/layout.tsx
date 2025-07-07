import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cinema App',
  description: 'Your ultimate movie experience',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen scrollbar-cinema">
        {children}
      </body>
    </html>
  )
}