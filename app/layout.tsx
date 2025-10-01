import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 服务端获取完整URL
async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

// 动态生成 Metadata
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getBaseUrl();

  return {
    metadataBase: new URL(baseUrl),
    
    title: {
      default: "資産運用セミナー | ライブ配信予告 - 投資の基礎から学ぶオンライン講座",
      template: "%s | 資産運用セミナー"
    },
    
    description: "毎週日曜20:00開催の資産運用オンラインセミナー。投資初心者から経験者まで、資産形成・投資戦略・ポートフォリオ構築について学べるライブ配信。株式会社アセットプランニング・ジャパン主催。",
    
    keywords: [
      "資産運用",
      "投資セミナー",
      "オンラインセミナー",
      "資産形成",
      "投資教育",
      "ライブ配信",
      "投資戦略",
      "ポートフォリオ",
      "金融教育",
      "資産管理"
    ],

    authors: [{ name: "株式会社アセットプランニング・ジャパン" }],
    creator: "株式会社アセットプランニング・ジャパン",
    publisher: "株式会社アセットプランニング・ジャパン",

    alternates: {
      canonical: '/',
    },

    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      url: baseUrl,
      siteName: '資産運用セミナー',
      title: '資産運用セミナー | ライブ配信予告',
      description: '毎週日曜20:00開催の資産運用オンラインセミナー。投資の基礎から実践まで学べるライブ配信。',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: '資産運用セミナー - オンラインライブ配信',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: '資産運用セミナー | ライブ配信予告',
      description: '毎週日曜20:00開催の資産運用オンラインセミナー。投資の基礎から実践まで学べるライブ配信。',
      images: ['/twitter-image.jpg'],
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

    applicationName: '資産運用セミナー',
    referrer: 'origin-when-cross-origin',
    category: 'Finance',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = await getBaseUrl();
  
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "株式会社アセットプランニング・ジャパン",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+81-3-6550-8820",
      "contactType": "Customer Service",
      "areaServed": "JP",
      "availableLanguage": ["Japanese", "English", "Chinese"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "虎ノ門2-10-4 オークラプレステージタワー15F",
      "addressLocality": "港区",
      "addressRegion": "東京都",
      "postalCode": "105-0001",
      "addressCountry": "JP"
    }
  };

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "資産運用セミナー オンライン配信",
    "description": "資産運用の基礎から実践まで学べるオンラインセミナー",
    "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "VirtualLocation",
      "url": baseUrl
    },
    "organizer": {
      "@type": "Organization",
      "name": "株式会社アセットプランニング・ジャパン",
      "url": baseUrl
    },
    "performer": {
      "@type": "Organization",
      "name": "株式会社アセットプランニング・ジャパン"
    },
    "isAccessibleForFree": true,
    "inLanguage": "ja"
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
