import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/blocks/Footer'
import Header from '@/components/blocks/Header'
import MobileNav from '@/components/blocks/MobileNav'

export const metadata: Metadata = {
  title: 'LS Lacrosse',
  description:
    'Official website for LS Lacrosse - Stay updated with game schedules, team rosters, news, and achievements.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <MobileNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
