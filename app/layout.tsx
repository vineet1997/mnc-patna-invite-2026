import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { preload } from "react-dom";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource-variable/manrope";
import "./globals.css";

const title = "Home Fashionista Rising 2026 · Patna";
const description = "Mukesh & Company invites Bihar's retail partners to preview the new season in Patna on 8 September 2026.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_IN",
      siteName: "Home Fashionista Rising 2026",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Home Fashionista Rising 2026 invitation for Patna" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}

export const viewport: Viewport = { themeColor: "#0a0609", colorScheme: "dark" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preload("/textile-hero-v2.png", { as: "image", fetchPriority: "high" });
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
