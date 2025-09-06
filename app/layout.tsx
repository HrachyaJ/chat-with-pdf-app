import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { SubscriptionProvider } from "@/hooks/useSubscriptionContext";

export const metadata: Metadata = {
  title: 'Chat with PDF App',
  description: 'An application to chat with your PDF documents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head />
        <body className="min-h-screen h-screen overflow-hidden flex flex-col">
          <SubscriptionProvider>
            <Toaster />
            {children}
          </SubscriptionProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}