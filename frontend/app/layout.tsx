import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TopNavigation from '@/components/TopNavigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Automation Empire',
  description: 'Professional AI-Powered Content & Service Sales Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          <TopNavigation />
          <main className="luxury-container">
            <div className="luxury-section">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}