import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SQL Visualizer — Learn SQL by seeing it',
  description:
    'The SQL learning platform that shows you how data transforms at every step. No abstract syntax — just live visual feedback.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}