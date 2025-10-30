"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Calendar } from "lucide-react"
import AgendaForm from "./AgendaForm"
import { useState } from "react"
import type { Agenda } from "@/services/AgendaService"

interface AgendaFormDialogProps {
    agendamento?: Agenda | null
    onSuccess?: () => void
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function AgendaFormDialog({
                                             agendamento,
                                             onSuccess,
                                             trigger,
                                             open: externalOpen,
                                             onOpenChange,
                                         }: AgendaFormDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)

    const isOpen = externalOpen !== undefined ? externalOpen : internalOpen
    const setIsOpen = onOpenChange || setInternalOpen

    const handleSuccess = () => {
        setIsOpen(false)
        onSuccess?.()
    }

    const handleCancel = () => {
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {!externalOpen && (
                <DialogTrigger asChild>
                    {trigger || (
                        <Button className="gap-2 h-11 px-6 shadow-sm">
                            {agendamento ? (
                                <>
                                    <Edit className="h-4 w-4" />
                                    Editar Agendamento
                                </>
                            ) : (
                                <>
                                    <Calendar className="h-5 w-5" />
                                    Nova Consulta
                                </>
                            )}
                        </Button>
                    )}
                </DialogTrigger>
            )}

            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold">
                        {agendamento ? "Editar Agendamento" : "Nova Consulta"}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        {agendamento ? "Atualize as informações do agendamento" : "Agende uma nova consulta para um paciente"}
                    </DialogDescription>
                </DialogHeader>

                <AgendaForm agendamento={agendamento} onSuccess={handleSuccess} onCancel={handleCancel} />
            </DialogContent>
        </Dialog>
    )
}
