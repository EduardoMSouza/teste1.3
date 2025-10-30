"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Agenda } from "@/services/AgendaService"

interface AgendaCalendarProps {
    agendamentos: Agenda[]
    onDateSelect?: (date: Date) => void
    selectedDate?: Date | null
}

interface DayInfo {
    date: Date
    isCurrentMonth: boolean
    isToday: boolean
    isSelected: boolean
    appointmentCount: number
    isFull: boolean
    isFree: boolean
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
const MESES = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
]

// Máximo de agendamentos por dia (considerando horários disponíveis)
const MAX_APPOINTMENTS_PER_DAY = 8

export function AgendaCalendar({ agendamentos, onDateSelect, selectedDate }: AgendaCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [calendarDays, setCalendarDays] = useState<DayInfo[]>([])
    const [isTransitioning, setIsTransitioning] = useState(false)

    useEffect(() => {
        setIsTransitioning(true)
        const timer = setTimeout(() => {
            generateCalendarDays()
            setIsTransitioning(false)
        }, 150)
        return () => clearTimeout(timer)
    }, [currentDate, agendamentos, selectedDate])

    const generateCalendarDays = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        // Primeiro dia do mês
        const firstDay = new Date(year, month, 1)
        // Último dia do mês
        const lastDay = new Date(year, month + 1, 0)

        // Dia da semana do primeiro dia (0 = Domingo)
        const startingDayOfWeek = firstDay.getDay()

        const days: DayInfo[] = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Dias do mês anterior
        const prevMonthLastDay = new Date(year, month, 0).getDate()
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthLastDay - i)
            days.push(createDayInfo(date, false, today))
        }

        // Dias do mês atual
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day)
            days.push(createDayInfo(date, true, today))
        }

        // Dias do próximo mês para completar a grade
        const remainingDays = 42 - days.length // 6 semanas * 7 dias
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day)
            days.push(createDayInfo(date, false, today))
        }

        setCalendarDays(days)
    }

    const createDayInfo = (date: Date, isCurrentMonth: boolean, today: Date): DayInfo => {
        const dateStr = date.toDateString()
        const todayStr = today.toDateString()
        const selectedStr = selectedDate?.toDateString()

        // Contar agendamentos para este dia
        const appointmentCount = agendamentos.filter((ag) => {
            const agDate = new Date(ag.dataHora)
            return agDate.toDateString() === dateStr && ag.status !== "CANCELADO"
        }).length

        // Verificar se o dia está cheio ou livre
        const isFull = appointmentCount >= MAX_APPOINTMENTS_PER_DAY
        const isFree = appointmentCount === 0 && isCurrentMonth && date >= today

        return {
            date,
            isCurrentMonth,
            isToday: dateStr === todayStr,
            isSelected: dateStr === selectedStr,
            appointmentCount,
            isFull,
            isFree,
        }
    }

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const handleToday = () => {
        setCurrentDate(new Date())
    }

    const handleDayClick = (dayInfo: DayInfo) => {
        if (dayInfo.isCurrentMonth && onDateSelect) {
            onDateSelect(dayInfo.date)
        }
    }

    const getDayClassName = (dayInfo: DayInfo) => {
        return cn(
            "relative h-20 p-2 border border-border/50 transition-all duration-300 cursor-pointer group",
            "hover:border-primary/60 hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10",
            "hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5",
            {
                "bg-muted/30 opacity-60": !dayInfo.isCurrentMonth,
                "bg-background": dayInfo.isCurrentMonth,
                "ring-2 ring-primary ring-offset-2 shadow-lg scale-[1.02]": dayInfo.isSelected,
                "border-primary/70 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm":
                    dayInfo.isToday && !dayInfo.isSelected,
            },
        )
    }

    const getDayStatusBadge = (dayInfo: DayInfo) => {
        if (!dayInfo.isCurrentMonth) return null

        if (dayInfo.isFull) {
            return (
                <Badge
                    variant="destructive"
                    className="absolute top-1 right-1 text-[10px] px-1.5 py-0 h-5 animate-in fade-in zoom-in duration-300"
                >
                    Cheio
                </Badge>
            )
        }

        if (dayInfo.isFree) {
            return (
                <Badge
                    variant="success"
                    className="absolute top-1 right-1 text-[10px] px-1.5 py-0 h-5 bg-emerald-500 hover:bg-emerald-600 animate-in fade-in zoom-in duration-300"
                >
                    Livre
                </Badge>
            )
        }

        if (dayInfo.appointmentCount > 0) {
            return (
                <Badge
                    variant="secondary"
                    className="absolute top-1 right-1 text-[10px] px-1.5 py-0 h-5 animate-in fade-in zoom-in duration-300"
                >
                    {dayInfo.appointmentCount}
                </Badge>
            )
        }

        return null
    }

    return (
        <Card className="w-full shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <CalendarIcon className="h-5 w-5 text-primary animate-in fade-in zoom-in duration-500" />
                        </div>
                        <div>
                            <CardTitle
                                className={cn("text-xl transition-all duration-300", isTransitioning && "opacity-0 translate-x-4")}
                            >
                                {MESES[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-0.5">Visualização mensal da agenda</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleToday}
                            className="h-9 bg-transparent hover:bg-primary/10 hover:border-primary/50 hover:scale-105 transition-all duration-200"
                        >
                            Hoje
                        </Button>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePrevMonth}
                                className="h-9 w-9 bg-transparent hover:bg-primary/10 hover:border-primary/50 hover:scale-110 transition-all duration-200"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNextMonth}
                                className="h-9 w-9 bg-transparent hover:bg-primary/10 hover:border-primary/50 hover:scale-110 transition-all duration-200"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Legenda */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm animate-in fade-in slide-in-from-left duration-300 delay-100">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-muted-foreground">Dias Livres</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm animate-in fade-in slide-in-from-left duration-300 delay-200">
                        <div className="h-3 w-3 rounded-full bg-secondary" />
                        <span className="text-muted-foreground">Com Agendamentos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm animate-in fade-in slide-in-from-left duration-300 delay-300">
                        <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                        <span className="text-muted-foreground">Dias Cheios</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {/* Cabeçalho dos dias da semana */}
                <div className="grid grid-cols-7 gap-0 mb-2">
                    {DIAS_SEMANA.map((dia, index) => (
                        <div
                            key={dia}
                            className={cn(
                                "h-10 flex items-center justify-center text-sm font-semibold text-muted-foreground",
                                "animate-in fade-in slide-in-from-top duration-300",
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {dia}
                        </div>
                    ))}
                </div>

                {/* Grade do calendário */}
                <div
                    className={cn(
                        "grid grid-cols-7 gap-0 border-t border-l transition-opacity duration-300",
                        isTransitioning && "opacity-0",
                    )}
                >
                    {calendarDays.map((dayInfo, index) => (
                        <div
                            key={index}
                            className={getDayClassName(dayInfo)}
                            onClick={() => handleDayClick(dayInfo)}
                            style={{
                                animationDelay: `${Math.floor(index / 7) * 30}ms`,
                                animationFillMode: "backwards",
                            }}
                        >
                            <div className="flex flex-col h-full">
                <span
                    className={cn("text-sm font-medium transition-all duration-200 group-hover:scale-110", {
                        "text-muted-foreground": !dayInfo.isCurrentMonth,
                        "text-foreground": dayInfo.isCurrentMonth,
                        "text-primary font-bold": dayInfo.isToday,
                    })}
                >
                  {dayInfo.date.getDate()}
                </span>

                                {dayInfo.isCurrentMonth && dayInfo.appointmentCount > 0 && !dayInfo.isFull && (
                                    <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>
                        {dayInfo.appointmentCount} consulta{dayInfo.appointmentCount > 1 ? "s" : ""}
                      </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {getDayStatusBadge(dayInfo)}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
