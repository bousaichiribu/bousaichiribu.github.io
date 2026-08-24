import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "bousaichiribu.github.io";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "防災地理部",
      template: "%s | 防災地理部",
    },
    description: "中高生が地域を歩き、声を聞き、地図を囲みながら、地域の未来と事前復興を考える年間活動です。",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      url: origin,
      siteName: "防災地理部",
      title: "防災地理部",
      description: "地域を知ることから、災害への備えは始まる。",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "防災地理部" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "防災地理部",
      description: "地域を知ることから、災害への備えは始まる。",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <a className="skip-link" href="#main-content">本文へ移動</a>
        {children}
      </body>
    </html>
  );
}
