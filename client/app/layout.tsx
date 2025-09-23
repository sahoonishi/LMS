import type React from "react";
import { Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "./ClientThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${josefin.variable} antialiased`}>
        {/* Only this wrapper is client-side */}
        <ClientThemeProvider>
          <div className="bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300">
            {children}
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
