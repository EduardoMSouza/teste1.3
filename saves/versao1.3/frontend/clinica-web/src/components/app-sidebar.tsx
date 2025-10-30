import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Calendar, Users, UserCircle, BarChart3, Home } from "lucide-react"
import Link from "next/link"

export function AppSidebar() {
    const menuItems = [
        {
            title: "Início",
            url: "/",
            icon: Home,
        },
        {
            title: "Agendamentos",
            url: "/agendamentos",
            icon: Calendar,
        },
        {
            title: "Pacientes",
            url: "/pacientes",
            icon: Users,
        },
        {
            title: "Dentistas",
            url: "/dentistas",
            icon: UserCircle,
        },
        {
            title: "Resumo",
            url: "/resumo",
            icon: BarChart3,
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-6 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                        <span className="text-sm font-bold text-white">D</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">DentalApp</h1>
                        <p className="text-xs text-muted-foreground">Gestão Odontológica</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navegação</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url} className="flex items-center gap-2">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-4 text-center text-xs text-muted-foreground">
                    <p>DentalApp v1.0</p>
                    <p>© 2024 Todos os direitos reservados</p>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}