import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lovecraft.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'LoveCraft — Créateur de Surprises Digitales & Messages Secrets 💖',
    template: '%s | LoveCraft'
  },
  description: 'LoveCraft est la plateforme française n°1 pour créer des surprises digitales personnalisées : enveloppe 3D interactive, question secrète, compte à rebours, fond musical et carte souvenir PNG. 100% Gratuit.',
  keywords: [
    'surprise digitale', 'message secret', 'lettre amour interactive',
    'enveloppe 3D', 'anniversaire', 'saint-valentin', 'demande en mariage',
    'déclaration amour', 'réconciliation', 'compte a rebours', 'lovecraft'
  ],
  authors: [{ name: 'LoveCraft Team', url: siteUrl }],
  creator: 'LoveCraft',
  publisher: 'LoveCraft',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'fr-FR': siteUrl,
    },
  },
  openGraph: {
    title: 'LoveCraft — Transformez vos émotions en souvenirs inoubliables 💖',
    description: 'Créez une surprise digitale unique avec enveloppe 3D interactive, question de déverrouillage, musique de fond et galerie photo.',
    url: siteUrl,
    siteName: 'LoveCraft',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/icon.svg`,
        width: 512,
        height: 512,
        alt: 'LoveCraft Logo — Surprises Digitales & Messages Secrets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LoveCraft — Surprises Digitales & Messages Secrets',
    description: 'Créez gratuitement des enveloppes 3D interactives et des messages secrets personnalisés.',
    images: [`${siteUrl}/icon.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'FR',
    'geo.placename': 'France',
    'geo.position': '48.8566;2.3522',
    'ICBM': '48.8566, 2.3522',
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#c026d3',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// JSON-LD Schemas pour AEO (Answer Engine Optimization) & GEO (Generative Engine Optimization)
const jsonLdWebApp = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LoveCraft',
  url: siteUrl,
  applicationCategory: 'EntertainmentApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  description: 'Plateforme en ligne permettant de composer des surprises digitales intimes et personnalisées avec enveloppe 3D interactive, déverrouillage par question secrète, ambiance musicale et carte souvenir.',
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qu\'est-ce que LoveCraft ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LoveCraft est un service en ligne gratuit permettant de créer des surprises digitales interactives (lettres d\'amour 3D, messages secrets déverrouillables avec une question, compte à rebours, musique et galerie photos).',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment créer un message secret avec une question de déverrouillage ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sur LoveCraft, composez votre message, choisissez une occasion et un ton, puis définissez une question secrète avec la réponse exacte. Le destinataire devra répondre correctement pour lire votre message.',
      },
    },
    {
      '@type': 'Question',
      name: 'Est-ce que LoveCraft est gratuit ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, la création, la publication, le partage par QR Code et le téléchargement des cartes souvenirs en image PNG sur LoveCraft sont 100% gratuits.',
      },
    },
  ],
}

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LoveCraft',
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  sameAs: [],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="bg-background" suppressHydrationWarning>
      <head suppressHydrationWarning />
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        {children}
      </body>
    </html>
  )
}
