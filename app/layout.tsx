import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TerraVigil - AI-Powered Mining Detection & Monitoring',
  description: 'Advanced AI system for detecting and monitoring illegal mining activities using satellite imagery and geospatial intelligence.',
  keywords: 'mining detection, illegal mining, satellite imagery, AI, geospatial intelligence, environmental monitoring',
  authors: [{ name: 'TerraVigil Inc.' }],
  openGraph: {
    title: 'TerraVigil - AI-Powered Mining Detection',
    description: 'Advanced AI system for detecting and monitoring illegal mining activities.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


