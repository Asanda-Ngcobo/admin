import { DM_Sans, Inter } from "next/font/google";

import "./globals.css";

const Primaryfont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const HeadingsFont = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: `Grossary | %s`,
    default: `Grossary | Admin`,
  }, 
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${HeadingsFont.variable} ${Primaryfont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}