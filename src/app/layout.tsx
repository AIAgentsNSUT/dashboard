import type { Metadata } from "next";
import "./globals.css";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";

export const metadata: Metadata = {
  title: "Aether HR",
  description: "AI Agents for HR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthKitProvider>{children}</AuthKitProvider>
      </body>
    </html>
  );
}
