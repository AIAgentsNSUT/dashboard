import type { Metadata } from "next";
import "./globals.css";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

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
      <body suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthKitProvider>
              <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden">
                  <AppSidebar />
                  <main className="h-full w-full flex flex-col overflow-hidden">
                    <Topbar />
                    <div className="p-4 h-full overflow-hidden">{children}</div>
                  </main>
                </div>
                <Toaster />
              </SidebarProvider>
            </AuthKitProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
