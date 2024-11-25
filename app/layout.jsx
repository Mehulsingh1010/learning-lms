import localFont from "next/font/local";
import "./globals.css";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Topper Town",
  description: "Study and excel",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className} suppressHydrationWarning>
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
