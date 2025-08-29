import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inder = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Deepseek",
  description: "Full stack AI-powered search multimodal chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inder.variable}antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
