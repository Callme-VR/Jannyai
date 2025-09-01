/* app/layout.tsx */
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import "./prism.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Deepseek",
  description: "Full stack AI-powered search multimodal chatbot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="antialiased">
          <AppContextProvider>
            <ErrorBoundary>
              <Toaster
                toastOptions={{
                  success: {
                    style: {
                      background: "green",
                      color: "white",
                    },
                  },
                  error: {
                    style: {
                      background: "red",
                      color: "white",
                    },
                  },
                }}
              />
              {children}
            </ErrorBoundary>
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
