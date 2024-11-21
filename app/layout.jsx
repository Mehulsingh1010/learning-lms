import localFont from "next/font/local";
import "./globals.css";
import {Outfit} from "next/font/google"


const outfit = Outfit({subsets:['latin']});


export const metadata = {
  title: "Learning LMS app",
  description: "Study and excel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={outfit.className}
        suppressHydrationWarning
      >
        
        {children}
      </body>
    </html>
  );
}
