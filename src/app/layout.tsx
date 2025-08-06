import type { Metadata, Viewport } from "next";
import { Inter, Kalam } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const kalam = Kalam({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-kalam",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Aori - Authentic Greek Street Food | Manchester",
  description: "Order delicious Greek street food from Aori restaurant. Fresh gyros, souvlaki, salads and more. Located at 78 Old Mill St, Manchester M4 6LW.",
  keywords: "Greek food, gyros, souvlaki, Manchester restaurant, street food, Greek cuisine, takeaway, collection",
  authors: [{ name: "Aori Restaurant" }],
  creator: "Aori Restaurant",
  publisher: "Aori Restaurant",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aori-restaurant.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Aori - Authentic Greek Street Food",
    description: "Order delicious Greek street food from Aori restaurant in Manchester",
    url: 'https://aori-restaurant.vercel.app',
    siteName: 'Aori Restaurant',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Aori Greek Restaurant'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Aori - Authentic Greek Street Food",
    description: "Order delicious Greek street food from Aori restaurant in Manchester",
    images: ['/og-image.png']
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Aori',
  },
};

export const viewport: Viewport = {
  themeColor: '#6B7C5F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Aori" />
        <meta name="apple-mobile-web-app-title" content="Aori" />
        <meta name="msapplication-TileColor" content="#6B7C5F" />
        <meta name="msapplication-navbutton-color" content="#6B7C5F" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-starturl" content="/" />
      </head>
      <body className={`${inter.variable} ${kalam.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
