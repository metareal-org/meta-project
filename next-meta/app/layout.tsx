import type { Metadata } from "next";
import "./globals.scss";
export const metadata: Metadata = {
  title: "Metareal",
  description: "Welcome to metaverse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head></head>
      <body>{children}</body>
    </html>
  );
}
