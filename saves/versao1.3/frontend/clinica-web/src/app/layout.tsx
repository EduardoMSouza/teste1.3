import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import React from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
        <body className="flex min-h-screen w-full">
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 flex flex-col">
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </SidebarProvider>
        </body>
        </html>
    )
}