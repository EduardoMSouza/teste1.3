// src/app/dashboard/agendamentos/components/AgendaForm.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Save, X, Search, User, Calendar, Clock, Sparkles, CheckCircle2, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { agendaService, type Agenda, type AgendaRequest, type Paciente, type Dentista } from "@/services/agendaService"

interface AgendaFormProps {
    agendamento?: Agenda | null
    onSuccess?: () => void
    onCancel?: () => void
}

// Horários de trabalho corrigidos
const HORARIOS_TRABALHO = {
    MANHA: { inicio: 9, fim: 12 }, // 9:00 às 12:00
    TARDE: { inicio: 14, fim: 18 }, // 14:00 às 18:00
    SABADO: { inicio: 8, fim: 12 }, // Sábado: 8:00 às 12:00
}

// Dias da semana que funcionam (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
const DIAS_TRABALHO = [1, 2, 3, 4, 5, 6] // Segunda a Sábado

export default function AgendaForm({ agendamento, onSuccess, onCancel }: AgendaFormProps) {
    const [submitting, setSubmitting] = useState(false)
    const [verificandoDisponibilidade, setVerificandoDisponibilidade] = useState(false)
    const [dentistas, setDentistas] = useState<Dentista[]>([])
    const [pacientes, setPacientes] = useState<Paciente[]>([])
    const [loadingDentistas, setLoadingDentistas] = useState(false)
    const [loadingPacientes, setLoadingPacientes] = useState(false)
    const [searchPaciente, setSearchPaciente] = useState("")
    const [usarPacienteCadastrado, setUsarPacienteCadastrado] = useState(true)
    const [showPacienteList, setShowPacienteList] = useState(false)

    const [formData, setFormData] = useState<AgendaRequest>({
        pacienteId: agendamento?.pacienteId || undefined,
        pacienteNome: agendamento?.pacienteNome || "",
        dentistaId: agendamento?.dentistaId || 0,
        dataHora: agendamento?.dataHora || "",
        observacoes: agendamento?.observacoes || "",
        telefone: agendamento?.telefone || "",
        email: agendamento?.email || "",
    })

    // Gerar slots de tempo disponíveis
    const generateTimeSlots = (date: Date | null) => {
        const slots = []
        const isSabado = date ? date.getDay() === 6 : false

        if (isSabado) {
            // Sábado: 8:00 às 12:00
            for (let hour = HORARIOS_TRABALHO.SABADO.inicio; hour <= HORARIOS_TRABALHO.SABADO.fim; hour++) {
                slots.push(`${hour.toString().padStart(2, "0")}:00`)
            }
        } else {
            // Segunda a Sexta
            // Horários da manhã: 9:00 às 12:00
            for (let hour = HORARIOS_TRABALHO.MANHA.inicio; hour <= HORARIOS_TRABALHO.MANHA.fim; hour++) {
                slots.push(`${hour.toString().padStart(2, "0")}:00`)
            }

            // Horários da tarde: 14:00 às 18:00
            for (let hour = HORARIOS_TRABALHO.TARDE.inicio; hour <= HORARIOS_TRABALHO.TARDE.fim; hour++) {
                slots.push(`${hour.toString().padStart(2, "0")}:00`)
            }
        }

        return slots
    }

    // Verificar se uma data é válida para agendamento
    const isValidAppointmentDate = (date: Date) => {
        const day = date.getDay()
        return DIAS_TRABALHO.includes(day)
    }

    // Verificar se um horário é válido
    const isValidAppointmentTime = (date: Date) => {
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const isSabado = date.getDay() === 6

        if (isSabado) {
            // Sábado: 8:00 às 12:00
            const isSabadoMorning = hours >= HORARIOS_TRABALHO.SABADO.inicio && hours <= HORARIOS_TRABALHO.SABADO.fim
            const isExactHour = minutes === 0
            return isSabadoMorning && isExactHour
        } else {
            // Segunda a Sexta
            const isMorning = hours >= HORARIOS_TRABALHO.MANHA.inicio && hours <= HORARIOS_TRABALHO.MANHA.fim
            const isAfternoon = hours >= HORARIOS_TRABALHO.TARDE.inicio && hours <= HORARIOS_TRABALHO.TARDE.fim
            const isExactHour = minutes === 0

            return (isMorning || isAfternoon) && isExactHour
        }
    }

    // Gerar datas disponíveis (próximos 60 dias)
    const getAvailableDates = () => {
        const today = new Date()
        const availableDates = []

        for (let i = 1; i <= 60; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() + i)

            if (isValidAppointmentDate(date)) {
                availableDates.push(new Date(date))
            }
        }

        return availableDates
    }

    // Formatar data para input datetime-local
    const formatDateForInput = (date: Date) => {
        return date.toISOString().slice(0, 16)
    }

    // Formatar data para exibição
    const formatDateForDisplay = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }
        return date.toLocaleDateString("pt-BR", options)
    }

    // Formatar hora para exibição
    const formatTimeForDisplay = (timeString: string) => {
        const [hours, minutes] = timeString.split(":")
        return `${hours}:${minutes}`
    }

    // Buscar próximo horário disponível
    const findNextAvailableSlot = async (dentistaId: number): Promise<string> => {
        try {
            const nextSlot = await agendaService.getProximoHorarioDisponivel(dentistaId)
            return nextSlot
        } catch (error) {
            console.error("Erro ao buscar próximo horário:", error)

            // Fallback: lógica local se a API falhar
            const now = new Date()
            const currentDate = new Date(now)
            currentDate.setHours(8, 0, 0, 0)

            // Encontrar próximo dia útil
            while (!isValidAppointmentDate(currentDate) || currentDate <= now) {
                currentDate.setDate(currentDate.getDate() + 1)
                currentDate.setHours(8, 0, 0, 0)
            }

            return formatDateForInput(currentDate)
        }
    }

    // Função de verificação de disponibilidade
    const verificarDisponibilidadeHorario = async (dentistaId: number, dataHora: string): Promise<boolean> => {
        if (!dentistaId || !dataHora) return true

        try {
            setVerificandoDisponibilidade(true)

            const disponivel = await agendaService.verificarDisponibilidadeHorario(
                dentistaId,
                dataHora,
                agendamento?.id
            )

            return disponivel
        } catch (error) {
            console.error("Erro ao verificar disponibilidade:", error)
            toast.error("Erro ao verificar disponibilidade do horário")
            return true // Permite continuar em caso de erro
        } finally {
            setVerificandoDisponibilidade(false)
        }
    }

    useEffect(() => {
        loadDentistas()
        if (agendamento?.pacienteId) {
            setUsarPacienteCadastrado(true)
            setSearchPaciente(agendamento.pacienteNome)
        } else if (agendamento?.pacienteNome) {
            setUsarPacienteCadastrado(false)
        }
    }, [agendamento])

    useEffect(() => {
        if (searchPaciente.length > 2 && usarPacienteCadastrado) {
            const timer = setTimeout(() => {
                loadPacientes(searchPaciente)
                setShowPacienteList(true)
            }, 500)
            return () => clearTimeout(timer)
        } else {
            setPacientes([])
            setShowPacienteList(false)
        }
    }, [searchPaciente, usarPacienteCadastrado])

    const loadDentistas = async () => {
        setLoadingDentistas(true)
        try {
            const data = await agendaService.getDentistas()
            setDentistas(data)
            if (!agendamento && data.length > 0) {
                setFormData((prev) => ({ ...prev, dentistaId: data[0].id }))
            }
        } catch (error: any) {
            console.error("Erro ao carregar dentistas:", error)
            toast.error("Erro ao carregar lista de dentistas")
        } finally {
            setLoadingDentistas(false)
        }
    }

    const loadPacientes = async (search: string) => {
        setLoadingPacientes(true)
        try {
            const data = await agendaService.getPacientes(search)
            setPacientes(data)
        } catch (error: any) {
            console.error("Erro ao carregar pacientes:", error)
            setPacientes([])
        } finally {
            setLoadingPacientes(false)
        }
    }

    const handleChange = (field: keyof AgendaRequest, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handlePacienteSelect = (paciente: Paciente) => {
        setFormData((prev) => ({
            ...prev,
            pacienteId: paciente.id,
            pacienteNome: paciente.nome,
            telefone: paciente.telefone || "",
            email: paciente.email || "",
        }))
        setSearchPaciente(paciente.nome)
        setPacientes([])
        setShowPacienteList(false)
    }

    const handleTipoAgendamentoChange = (usarCadastrado: boolean) => {
        setUsarPacienteCadastrado(usarCadastrado)
        if (usarCadastrado) {
            setFormData((prev) => ({
                ...prev,
                pacienteNome: "",
                telefone: "",
                email: "",
            }))
            setSearchPaciente("")
        } else {
            setFormData((prev) => ({
                ...prev,
                pacienteId: undefined,
            }))
            setSearchPaciente("")
            setPacientes([])
        }
        setShowPacienteList(false)
    }

    const handleDateChange = async (dateString: string) => {
        const selectedDate = new Date(dateString)

        if (!isValidAppointmentDate(selectedDate)) {
            toast.error("Não é possível agendar para domingos")
            return
        }

        const currentTime = formData.dataHora ? new Date(formData.dataHora) : new Date()

        if (formData.dataHora) {
            selectedDate.setHours(currentTime.getHours())
            selectedDate.setMinutes(currentTime.getMinutes())
        } else {
            // Define horário padrão baseado no dia
            const isSabado = selectedDate.getDay() === 6
            selectedDate.setHours(isSabado ? 8 : 9, 0, 0, 0)
        }

        const newDataHora = formatDateForInput(selectedDate)
        handleChange("dataHora", newDataHora)

        // Verificar disponibilidade após mudança de data
        if (formData.dentistaId && newDataHora) {
            const disponivel = await verificarDisponibilidadeHorario(formData.dentistaId, newDataHora)
            if (!disponivel) {
                toast.warning("Horário indisponível para este dentista. Por favor, selecione outro horário.")
            }
        }
    }

    const handleTimeChange = async (timeString: string) => {
        if (!formData.dataHora) {
            toast.error("Selecione uma data primeiro")
            return
        }

        const [hours, minutes] = timeString.split(":").map(Number)
        const selectedDate = new Date(formData.dataHora)
        selectedDate.setHours(hours, minutes, 0, 0)

        if (!isValidAppointmentTime(selectedDate)) {
            const selectedDateObj = new Date(formData.dataHora)
            const isSabado = selectedDateObj.getDay() === 6

            if (isSabado) {
                toast.error("Horário fora do expediente de sábado (8:00-12:00)")
            } else {
                toast.error("Horário fora do expediente (9:00-12:00 e 14:00-18:00)")
            }
            return
        }

        const newDataHora = formatDateForInput(selectedDate)
        handleChange("dataHora", newDataHora)

        // Verificar disponibilidade após mudança de horário
        if (formData.dentistaId) {
            const disponivel = await verificarDisponibilidadeHorario(formData.dentistaId, newDataHora)
            if (!disponivel) {
                toast.warning("Horário indisponível para este dentista. Por favor, selecione outro horário.")
            }
        }
    }

    const useNextAvailableSlot = async () => {
        if (!formData.dentistaId) {
            toast.error("Selecione um dentista primeiro")
            return
        }

        try {
            const nextSlot = await findNextAvailableSlot(formData.dentistaId)
            handleChange("dataHora", nextSlot)
            toast.success("Próximo horário disponível selecionado!")
        } catch (error) {
            console.error("Erro ao buscar próximo horário:", error)
            toast.error("Erro ao buscar próximo horário disponível")
        }
    }

    // Validação do formulário
    const validateForm = async (): Promise<boolean> => {
        // Validações básicas
        if (!formData.dentistaId) {
            toast.error("Selecione um dentista")
            return false
        }

        if (!formData.dataHora) {
            toast.error("Selecione a data e hora")
            return false
        }

        const selectedDate = new Date(formData.dataHora)
        const now = new Date()

        // Validar se é uma data futura
        if (selectedDate <= now) {
            toast.error("Selecione uma data e hora futura")
            return false
        }

        // Validar dia da semana
        if (!isValidAppointmentDate(selectedDate)) {
            toast.error("Não é possível agendar para domingos")
            return false
        }

        // Validar horário de trabalho
        if (!isValidAppointmentTime(selectedDate)) {
            const isSabado = selectedDate.getDay() === 6
            if (isSabado) {
                toast.error("Horário fora do expediente de sábado (8:00-12:00)")
            } else {
                toast.error("Horário fora do expediente (9:00-12:00 e 14:00-18:00)")
            }
            return false
        }

        // Validar paciente
        if (usarPacienteCadastrado && !formData.pacienteId) {
            toast.error("Selecione um paciente cadastrado")
            return false
        }

        if (!usarPacienteCadastrado && !formData.pacienteNome?.trim()) {
            toast.error("Nome do paciente é obrigatório para agendamentos rápidos")
            return false
        }

        // Verificação de disponibilidade
        try {
            const disponivel = await verificarDisponibilidadeHorario(formData.dentistaId, formData.dataHora)

            if (!disponivel) {
                toast.error("Este horário não está mais disponível. Por favor, selecione outro horário.")
                return false
            }
        } catch (error) {
            console.error("Erro na validação de disponibilidade:", error)
            toast.error("Erro ao verificar disponibilidade do horário")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const isValid = await validateForm()
        if (!isValid) return

        setSubmitting(true)
        try {
            const dadosEnvio: AgendaRequest = {
                dentistaId: formData.dentistaId,
                dataHora: formData.dataHora,
                observacoes: formData.observacoes,
            }

            if (usarPacienteCadastrado) {
                dadosEnvio.pacienteId = formData.pacienteId
            } else {
                dadosEnvio.pacienteNome = formData.pacienteNome
                dadosEnvio.telefone = formData.telefone
                dadosEnvio.email = formData.email
            }

            console.log("Enviando dados:", dadosEnvio)

            if (agendamento) {
                await agendaService.updateAgendamento(agendamento.id, dadosEnvio)
                toast.success("Agendamento atualizado com sucesso!")
            } else {
                await agendaService.createAgendamento(dadosEnvio)
                toast.success("Agendamento criado com sucesso!")
            }

            onSuccess?.()
        } catch (error: any) {
            console.error("Erro ao salvar agendamento:", error)

            // Tratamento de erro mais específico
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else if (error.message?.includes("ConflitoAgendamentoException")) {
                toast.error("Já existe um agendamento para este dentista no horário selecionado")
            } else {
                toast.error("Erro ao salvar agendamento. Tente novamente.")
            }
        } finally {
            setSubmitting(false)
        }
    }

    const selectedDate = formData.dataHora ? new Date(formData.dataHora) : null
    const selectedTime = selectedDate
        ? `${selectedDate.getHours().toString().padStart(2, "0")}:${selectedDate.getMinutes().toString().padStart(2, "0")}`
        : ""

    const timeSlots = generateTimeSlots(selectedDate)
    const isSabado = selectedDate ? selectedDate.getDay() === 6 : false

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Agendamento */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground">Tipo de Agendamento</Label>
                <RadioGroup
                    value={usarPacienteCadastrado ? "cadastrado" : "rapido"}
                    onValueChange={(value) => handleTipoAgendamentoChange(value === "cadastrado")}
                    className="grid grid-cols-2 gap-3"
                >
                    <Label
                        htmlFor="cadastrado"
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            usarPacienteCadastrado
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border hover:border-primary/50 hover:bg-muted/50",
                        )}
                    >
                        <RadioGroupItem value="cadastrado" id="cadastrado" />
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium text-sm">Paciente Cadastrado</span>
                        </div>
                    </Label>

                    <Label
                        htmlFor="rapido"
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                            !usarPacienteCadastrado
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border hover:border-primary/50 hover:bg-muted/50",
                        )}
                    >
                        <RadioGroupItem value="rapido" id="rapido" />
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            <span className="font-medium text-sm">Agendamento Rápido</span>
                        </div>
                    </Label>
                </RadioGroup>
            </div>

            {/* Seção de Paciente */}
            <div className="space-y-4 p-5 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-base">Informações do Paciente</h3>
                </div>

                {usarPacienteCadastrado ? (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="search-paciente" className="text-sm font-medium">
                                Buscar Paciente <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                <Input
                                    id="search-paciente"
                                    placeholder="Digite o nome do paciente..."
                                    value={searchPaciente}
                                    onChange={(e) => setSearchPaciente(e.target.value)}
                                    onFocus={() => searchPaciente.length > 2 && setShowPacienteList(true)}
                                    className="pl-10 h-11 bg-background"
                                />
                                {loadingPacientes && (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                            </div>

                            {/* Lista de Pacientes */}
                            {showPacienteList && pacientes.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 border bg-background rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {pacientes.map((p) => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            className="w-full p-3 text-left hover:bg-muted/80 transition-colors border-b last:border-0 flex items-start gap-3"
                                            onClick={() => handlePacienteSelect(p)}
                                        >
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm">{p.nome}</div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {p.telefone && `${p.telefone}`}
                                                    {p.telefone && p.email && " • "}
                                                    {p.email}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {showPacienteList && searchPaciente.length > 2 && pacientes.length === 0 && !loadingPacientes && (
                                <div className="absolute z-50 w-full mt-1 border bg-background rounded-lg shadow-lg p-4 text-center text-muted-foreground">
                                    Nenhum paciente encontrado
                                </div>
                            )}
                        </div>

                        {/* Paciente Selecionado */}
                        {formData.pacienteId && (
                            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                                        Paciente Selecionado
                                    </div>
                                    <div className="font-semibold text-emerald-900 dark:text-emerald-100">{formData.pacienteNome}</div>
                                    {(formData.telefone || formData.email) && (
                                        <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                                            {formData.telefone && `${formData.telefone}`}
                                            {formData.telefone && formData.email && " • "}
                                            {formData.email}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome-paciente" className="text-sm font-medium">
                                Nome Completo <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="nome-paciente"
                                placeholder="Digite o nome completo do paciente"
                                value={formData.pacienteNome || ""}
                                onChange={(e) => handleChange("pacienteNome", e.target.value)}
                                className="h-11 bg-background"
                                required
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="telefone" className="text-sm font-medium flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5" />
                                    Telefone
                                </Label>
                                <Input
                                    id="telefone"
                                    placeholder="(00) 00000-0000"
                                    value={formData.telefone || ""}
                                    onChange={(e) => handleChange("telefone", e.target.value)}
                                    className="h-11 bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5" />
                                    E-mail
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    value={formData.email || ""}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="h-11 bg-background"
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-blue-700 dark:text-blue-300">
                                <strong>Agendamento rápido:</strong> o paciente será registrado apenas na agenda, sem cadastro completo
                                no sistema. Ideal para pacientes novos ou consultas avulsas.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Seção de Agendamento */}
            <div className="space-y-4 p-5 rounded-lg bg-muted/30 border">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-base">Data e Horário</h3>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dentista" className="text-sm font-medium">
                        Dentista <span className="text-destructive">*</span>
                    </Label>
                    <Select
                        value={formData.dentistaId?.toString()}
                        onValueChange={(v) => handleChange("dentistaId", Number.parseInt(v))}
                        disabled={loadingDentistas}
                    >
                        <SelectTrigger id="dentista" className="h-11 bg-background">
                            <SelectValue placeholder={loadingDentistas ? "Carregando..." : "Selecione o dentista"} />
                        </SelectTrigger>
                        <SelectContent>
                            {dentistas.map((d) => (
                                <SelectItem key={d.id} value={d.id.toString()}>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{d.nome}</span>
                                        <span className="text-xs text-muted-foreground">• {d.especialidade}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="data" className="text-sm font-medium">
                            Data <span className="text-destructive">*</span>
                        </Label>
                        <Select value={selectedDate ? selectedDate.toDateString() : ""} onValueChange={handleDateChange}>
                            <SelectTrigger id="data" className="h-11 bg-background">
                                <SelectValue placeholder="Selecione a data" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {getAvailableDates().map((date) => (
                                    <SelectItem key={date.toDateString()} value={date.toDateString()}>
                                        {formatDateForDisplay(date)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="horario" className="text-sm font-medium">
                            Horário <span className="text-destructive">*</span>
                        </Label>
                        <Select value={selectedTime} onValueChange={handleTimeChange} disabled={!formData.dataHora}>
                            <SelectTrigger id="horario" className="h-11 bg-background">
                                <SelectValue placeholder={formData.dataHora ? "Selecione o horário" : "Selecione a data primeiro"} />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5" />
                                            {formatTimeForDisplay(time)}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Indicador de verificação de disponibilidade */}
                {verificandoDisponibilidade && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verificando disponibilidade...
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    onClick={useNextAvailableSlot}
                    disabled={!formData.dentistaId || submitting || verificandoDisponibilidade}
                    className="w-full h-11 gap-2 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 border-primary/20"
                >
                    <Sparkles className="h-4 w-4" />
                    Buscar Próximo Horário Disponível
                </Button>

                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {isSabado
                        ? "Horários disponíveis aos sábados: 8:00-12:00"
                        : "Horários disponíveis: Segunda a Sexta, 9:00-12:00 e 14:00-18:00"
                    }
                </p>
            </div>

            {/* Observações */}
            <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-sm font-medium">
                    Observações
                </Label>
                <Textarea
                    id="observacoes"
                    rows={4}
                    value={formData.observacoes}
                    onChange={(e) => handleChange("observacoes", e.target.value)}
                    placeholder="Adicione observações sobre o agendamento (opcional)"
                    className="resize-none bg-background"
                />
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="flex-1 h-12 gap-2 bg-transparent"
                        disabled={submitting || verificandoDisponibilidade}
                    >
                        <X className="h-4 w-4" />
                        Cancelar
                    </Button>
                )}
                <Button
                    type="submit"
                    className="flex-1 h-12 gap-2 shadow-md"
                    disabled={submitting || verificandoDisponibilidade}
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            {agendamento ? "Salvar Alterações" : "Agendar Consulta"}
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}