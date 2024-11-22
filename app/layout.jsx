import localFont from "next/font/local";
import "./globals.css";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Topper Stack",
  description: "Study and excel",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className} suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
