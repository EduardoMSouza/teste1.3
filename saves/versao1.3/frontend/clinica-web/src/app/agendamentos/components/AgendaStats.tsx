"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, CheckCircle2, Clock, XCircle } from "lucide-react"
import type { Agenda } from "@/services/AgendaService"

interface AgendaStatsProps {
    agendamentos: Agenda[]
}

export function AgendaStats({ agendamentos }: AgendaStatsProps) {
    const total = agendamentos.length
    const confirmados = agendamentos.filter((ag) => ag.status === "CONFIRMADO").length
    const concluidos = agendamentos.filter((ag) => ag.status === "CONCLUIDO").length
    const cancelados = agendamentos.filter((ag) => ag.status === "CANCELADO").length
    const pendentes = agendamentos.filter((ag) => ag.status === "AGENDADO").length

    const stats = [
        {
            label: "Total",
            value: total,
            icon: Calendar,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
        },
        {
            label: "Confirmados",
            value: confirmados,
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
        },
        {
            label: "Pendentes",
            value: pendentes,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
        },
        {
            label: "Cancelados",
            value: cancelados,
            icon: XCircle,
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100 dark:bg-red-900/30",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <Card
                    key={stat.label}
                    className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "backwards" }}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div
                                className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-110 hover:rotate-6`}
                            >
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
