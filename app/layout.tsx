import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flavor — Food Assistant',
  description: 'Your personal food and recipe assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}