import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import '@rainbow-me/rainbowkit/styles.css'



export const metadata: Metadata = {
  title: "Hello, Blockchain!",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <Providers>
          {children}
          </Providers>
      </body>
    </html>
  );
}
