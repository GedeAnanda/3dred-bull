import type { Metadata, Viewport } from "next";
import { Bebas_Neue, JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const source = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
});

const jet = JetBrains_Mono({
  variable: "--font-jet",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Red Bull GmbH — Company Profile",
  description:
    "From one drink launched in Austria in 1987 to 13.97 billion cans a year in 178 countries. An interactive company profile of Red Bull GmbH.",
};

export const viewport: Viewport = {
  themeColor: "#050a1c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bebas.variable} ${source.variable} ${jet.variable} antialiased`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
