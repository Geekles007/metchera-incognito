import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { IdentityProvider } from "../contexts/IdentityContext";
import AutoDeleteScheduler from "../components/AutoDeleteScheduler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metchera Incognito - Create Temporary Identities",
  description: "Generate realistic temporary identities with details like name, address, phone number, temporary email, and an AI-generated avatar.",
  keywords: "identity generator, fake identity, temporary email, privacy tool, testing data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <IdentityProvider>
          <AutoDeleteScheduler />
          {children}
        </IdentityProvider>
      </body>
    </html>
  );
}
