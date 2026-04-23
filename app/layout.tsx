import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import '@/styles/globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-head',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://nandez-garcia.vercel.app"),
  title: 'Nández García — Webs y productos digitales que consiguen clientes',
  description:
    'Ingeniero de sistemas, máster en marketing digital y experto en IA. Creo páginas web y productos digitales que traen clientes de verdad, en semanas en vez de meses.',
  keywords: [
    'desarrollo web',
    'producto digital',
    'IA aplicada',
    'marketing digital',
    'páginas web que convierten',
    'lanzar una idea',
    'emprendedores',
    'Nández García',
  ],
  authors: [{ name: 'Nández García' }],
  openGraph: {
    title: 'Nández García — Webs y productos digitales que consiguen clientes',
    description:
      'Ingeniero + máster en marketing + IA aplicada. Construyo webs que captan clientes y convierto ideas en productos reales, en semanas.',
    url: 'https://nandezgarcia.com',
    siteName: 'Nández García',
    locale: 'es_ES',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nández García — Webs y productos digitales que consiguen clientes',
    description:
      'Tecnología + marketing + negocio en la misma persona. Resultados reales en semanas.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://nandezgarcia.com' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Nández García',
              url: 'https://nandezgarcia.com',
              jobTitle:
                'Ingeniero de sistemas, máster en marketing digital y especialista en IA aplicada',
              description:
                'Creo páginas web y productos digitales que consiguen clientes reales, combinando tecnología, marketing y negocio en una sola persona.',
            }),
          }}
        />
      </head>
      <body className="font-body">{children}</body>
    </html>
  )
}
