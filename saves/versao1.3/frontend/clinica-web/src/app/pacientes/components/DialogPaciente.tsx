// app/pacientes/components/DialogPaciente.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import PacienteForm from "./PacienteForm"

interface Paciente {
    id: number;
    nome: string;
    cpf?: string;
    rg?: string;
    email?: string;
    telefone?: string;
    dataNascimento?: string;
    sexo?: 'MASCULINO' | 'FEMININO' | 'OUTRO';
    estadoCivil?: string;
    profissao?: string;
    naturalidade?: string;
    nacionalidade?: string;
    convenio?: string;
    numeroCarteirinha?: string;
    endereco?: {
        logradouro?: string;
        numero?: string;
        complemento?: string;
        bairro?: string;
        cidade?: string;
        estado?: string;
        cep?: string;
    };
    contatoEmergencia?: {
        nome?: string;
        telefone?: string;
        parentesco?: string;
    };
    responsavel?: {
        nome?: string;
        telefone?: string;
    };
    indicadoPor?: string;
    observacoesGerais?: string;
    dataCadastro: string;
    dataAtualizacao: string;
    status: string;
}

interface DialogPacienteProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    pacienteEdit?: Paciente | null
    onCreate: (data: any) => Promise<void>
    onUpdate: (id: number, data: any) => Promise<void>
    loading?: boolean
}

export default function DialogPaciente({
                                           open,
                                           onOpenChange,
                                           onSuccess,
                                           pacienteEdit,
                                           onCreate,
                                           onUpdate,
                                           loading
                                       }: DialogPacienteProps) {
    const [error, setError] = useState<string | null>(null)

    const handleSave = async (formData: any) => {
        try {
            setError(null)

            if (pacienteEdit) {
                await onUpdate(pacienteEdit.id, formData)
            } else {
                await onCreate(formData)
            }

            onSuccess?.()
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar paciente')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {pacienteEdit ? 'Editar Paciente' : 'Novo Paciente'}
                    </DialogTitle>
                    <DialogDescription>
                        {pacienteEdit
                            ? 'Atualize as informações do paciente'
                            : 'Preencha os dados do novo paciente'
                        }
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <PacienteForm
                    onSubmit={handleSave}
                    loading={loading}
                    pacienteEdit={pacienteEdit}
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