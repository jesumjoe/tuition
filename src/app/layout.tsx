import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-noto"
});

export const metadata: Metadata = {
  title: "Namma Tuition | Manage Your Center Effortlessly",
  description: "Attendance, fees, and progress reports with daily WhatsApp digests for small tuition centers.",
};

export const viewport: Viewport = {
  width: "device-width",
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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        noto.variable
      )}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
