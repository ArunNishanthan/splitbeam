import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import * as React from "react";

import "./globals.css";

import { DataProviderProvider } from "@/data/data-provider-context";
import { cn } from "@/lib/utils";
import { TopNav } from "@/components/navigation/top-nav";
import { ThemeProvider } from "@/components/theme/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "SplitBeam",
  description: "Shared expenses without the spreadsheet spiral.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable, jetbrains.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DataProviderProvider>
            <div className="flex min-h-screen flex-col">
              <TopNav />
              <main className="flex-1 bg-muted/10">
                <div className="container py-10">{children}</div>
              </main>
              <footer className="border-t border-border/60 bg-background/80 py-6">
                <div className="container text-sm text-muted-foreground">
                  © {new Date().getFullYear()} SplitBeam. Mock data only.
                </div>
              </footer>
            </div>
          </DataProviderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
