import type { Metadata } from "next";
import { Cinzel, IBM_Plex_Sans } from "next/font/google";

import "./globals.css";

const display = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pen364692088.github.io"),
  title: "Ashen Archive",
  description: "Dark fantasy inspired portfolio for Unity systems, technical art, VFX, and playable fragments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>{children}</body>
    </html>
  );
}
