import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/landing/Navbar";

export const metadata: Metadata = {
  title: "Flavor — Food Assistant",
  description: "Your personal food and recipe assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
