import type { Metadata } from "next";
import "./globals.css";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthKitProvider>
            <SidebarProvider>
              <AppSidebar />

              <main className="w-full min-h-screen">
                <Topbar />
                <div className="px-6 py-3">{children}</div>
              </main>
            </SidebarProvider>
          </AuthKitProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
