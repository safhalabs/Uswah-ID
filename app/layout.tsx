import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Uswah.id — Pengingat Sholat, Kalender Hijriah & Meneladani Sunnah",
  description:
    "Aplikasi Islami penuntun jadwal sholat standar Kemenag RI, kalender Hijriah, puasa sunnah & wajib, serta amalan meneladani Rasulullah SAW.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  keywords: [
    "jadwal sholat",
    "pengingat sholat",
    "kalender hijriah",
    "puasa sunnah",
    "ayyamul bidh",
    "meneladani rasulullah",
    "uswah",
    "kemenag",
  ],
};

export const viewport: Viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="islamic-bg-pattern font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
