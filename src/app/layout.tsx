import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.scss";
import { FilmGrain } from "@/components/FilmGrain";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Add your additional fonts here:
// import { Your_Font } from "next/font/google";
// const yourFont = Your_Font({
//   variable: "--font-your-font",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "EDUBA",
  description: "The Faces of Interface",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ibmPlexMono.variable} style={{ fontFamily: 'var(--font-ibm-plex-mono)' }}>
        {children}
        <FilmGrain />
      </body>
    </html>
  );
}
