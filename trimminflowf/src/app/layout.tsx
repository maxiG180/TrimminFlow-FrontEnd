import type { Metadata } from "next";
import { Bebas_Neue, Oswald } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Bold, condensed font for headings and branding
const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
  display: "swap",
});

// Condensed font for body text (similar style to Bebas Neue but with lowercase)
const oswald = Oswald({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRIMMINFLOW - Modern Barbershop Management",
  description: "Transform your barbershop with smart scheduling, online booking, and customer management",
  icons: {
    icon: [
      { url: '/img/logo.png', sizes: 'any' },
      { url: '/img/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/img/logo.png',
    shortcut: '/img/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${bebasNeue.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
