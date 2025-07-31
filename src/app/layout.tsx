import './globals.css';
import { Poppins } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata = {
  title: 'QR Code Generator',
  description: 'Create and customize QR codes easily with watermarks, custom colors, and instant downloads',
  keywords: 'QR code, generator, custom, watermark, download, free',
  authors: [{ name: 'Faint' }],
  creator: 'Faint',
  publisher: 'Faint',
  
  openGraph: {
    title: 'QR Code Generator',
    description: 'Create and customize QR codes easily with watermarks, custom colors, and instant downloads',
    url: 'https://qr.typescript.rocks',
    siteName: 'QR Code Generator',
    images: [
      {
        url: 'https://qr.typescript.rocks/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QR Code Generator - Create custom QR codes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator',
    description: 'Create and customize QR codes easily with watermarks, custom colors, and instant downloads',
    creator: '@typescript_rocks',
    images: ['https://qr.typescript.rocks/og-image.png'],
  },
  
  // Additional meta tags
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
  
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/og-image.png',
  },
  
  manifest: '/manifest.json',
  
  themeColor: '#000000',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}