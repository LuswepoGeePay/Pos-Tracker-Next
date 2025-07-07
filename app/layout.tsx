import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/custom/common/provider";
import { Toaster } from "react-hot-toast";
import 'leaflet/dist/leaflet.css'; 

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: "POS Tracker",
  description: "A Point of sale tracker designed by GeePay for GeePay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
