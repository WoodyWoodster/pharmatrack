import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PharmaTrack - Inventory Management",
  description: "Pharmacy inventory management system",
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
        <QueryProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "white",
                border: "4px solid black",
                boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
                borderRadius: "0px",
                fontWeight: "bold",
                fontSize: "14px",
                padding: "16px",
                color: "black",
              },
              className: "neo-brutal-toast",
            }}
            theme="light"
          />
        </QueryProvider>
      </body>
    </html>
  );
}
