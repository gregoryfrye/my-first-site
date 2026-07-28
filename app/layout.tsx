import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/app/components/footer";
import { Nav } from "@/app/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Greg Frye",
  description: "Creative Director & Brand + Product Designer",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
