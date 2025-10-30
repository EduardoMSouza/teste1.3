// src/app/dashboard/dentistas/components/DialogDentista.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import DentistaForm from "./DentistaForm"
import { dentistaService, DentistaCreateDTO, DentistaUpdateDTO } from "@/services/dentistaService"

interface Dentista {
    id: number;
    nome: string;
    cro: string;
    especialidade?: string;
    telefone?: string;
    email?: string;
    ativo: boolean;
}

interface DialogDentistaProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    dentistaEdit?: Dentista | null
}

export default function DialogDentista({ open, onOpenChange, onSuccess, dentistaEdit }: DialogDentistaProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSave = async (formData: any) => {
        try {
            setLoading(true)
            setError(null)

            if (!formData.nome.trim()) throw new Error("Nome é obrigatório")
            if (!formData.cro.trim()) throw new Error("CRO é obrigatório")

            if (dentistaEdit) {
                const dto: DentistaUpdateDTO = { ...formData }
                await dentistaService.atualizar(dentistaEdit.id, dto)
            } else {
                const dto: DentistaCreateDTO = { ...formData }
                await dentistaService.criar(dto)
            }

            onSuccess?.()
        } catch (err: any) {
            setError(err.message || "Erro ao salvar dentista")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{dentistaEdit ? "Editar Dentista" : "Novo Dentista"}</DialogTitle>
                    <DialogDescription>
                        {dentistaEdit ? "Atualize as informações do dentista" : "Preencha os dados do novo dentista"}
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <DentistaForm
                    onSubmit={handleSave}
                    loading={loading}
                    defaultValues={dentistaEdit}
                />

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}