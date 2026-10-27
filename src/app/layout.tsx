import type { Metadata } from "next";
import { Fira_Sans_Extra_Condensed, Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

// Both fonts include Greek, so headings and body look the same in EL and EN.
const display = Fira_Sans_Extra_Condensed({
  variable: "--font-display",
  weight: ["600", "800", "900"],
  subsets: ["latin", "greek", "latin-ext"],
  display: "swap",
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "greek", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://9ballshop.com"),
  title: {
    default: "Marios Komninakis \u2013 Pool Coach & Player | 9BallShop",
    template: "%s | Marios Komninakis",
  },
  description:
    "Pool and 9-ball coaching by Marios Komninakis, 2x Greek national youth champion. Lessons in technique, strategy and mindset, plus free drills.",
  applicationName: "9BallShop",
  authors: [{ name: "Marios Komninakis", url: "https://9ballshop.com/about" }],
  openGraph: {
    type: "website",
    siteName: "9BallShop \u2013 Marios Komninakis",
    locale: "en_US",
    alternateLocale: ["el_GR"],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem("9ballshop-lang");if(l==="el")document.documentElement.lang="el"}catch(e){}`,
          }}
        />
      </head>
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="pt-16 min-h-screen">{children}</main>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
