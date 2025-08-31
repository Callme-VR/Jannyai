import type { Metadata } from "next";
import {
  ClerkProvider,
  // SignInButton,
  // SignUpButton,
  // SignedIn,
  // SignedOut,
  // UserButton,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css"
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";


const inter = Inter({
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
    <ClerkProvider>
      <AppContextProvider>
        <html lang="en">
          <body className={`${inter.variable} antialiased`}>
            <Toaster toastOptions={{
              success: {
                style: {
                  background: 'green',
                  color: 'white'
                }
              },
              error: {
                style: {
                  background: 'red',
                  color: 'white'
                }
              }
            }} />
            {children}
          </body>
        </html>
      </AppContextProvider>
    </ClerkProvider>
  );
}
