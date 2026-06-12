import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://goprismamx.com'),
  title: 'Prisma Real Estate | Casas, Departamentos y Terrenos en Venta y Renta',
  description: 'Propiedades en Nayarit, Jalisco y Sinaloa. Casas, departamentos, terrenos y locales comerciales en venta y renta.',
  keywords: 'prisma real estate, casas en venta tepic, departamentos renta tepic, terrenos tepic, propiedades nayarit, bienes raices tepic, renta tepic',
  authors: [{ name: 'Prisma Real Estate' }],
  openGraph: {
    title: 'Prisma Real Estate | Propiedades en Venta y Renta',
    description: 'Propiedades en Nayarit, Jalisco y Sinaloa. Casas, departamentos, terrenos y locales comerciales.',
    type: 'website',
    locale: 'es_MX',
    siteName: 'Prisma Real Estate',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Prisma Real Estate - Propiedades en Nayarit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prisma Real Estate | Propiedades en Venta y Renta',
    description: 'Propiedades en Nayarit, Jalisco y Sinaloa.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-MX">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="geo.region" content="MX-NAY" />
        <meta name="geo.placename" content="Tepic" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
