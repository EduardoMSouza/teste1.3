// src/app/dashboard/dentistas/components/DentistaForm.tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface DentistaFormData {
    nome: string
    cro: string
    especialidade: string
    telefone: string
    email: string
    ativo: boolean
}

interface DentistaFormProps {
    defaultValues?: DentistaFormData | null
    onSubmit: (data: DentistaFormData) => void
    loading?: boolean
}

export default function DentistaForm({ defaultValues, onSubmit, loading }: DentistaFormProps) {
    const [formData, setFormData] = useState<DentistaFormData>({
        nome: defaultValues?.nome || "",
        cro: defaultValues?.cro || "",
        especialidade: defaultValues?.especialidade || "",
        telefone: defaultValues?.telefone || "",
        email: defaultValues?.email || "",
        ativo: defaultValues?.ativo ?? true,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="nome">Nome *</Label>
                        <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            placeholder="Digite o nome completo"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="cro">CRO *</Label>
                        <Input
                            id="cro"
                            value={formData.cro}
                            onChange={(e) => setFormData({ ...formData, cro: e.target.value })}
                            placeholder="Ex: SP-12345"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="especialidade">Especialidade</Label>
                        <Input
                            id="especialidade"
                            value={formData.especialidade}
                            onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                            placeholder="Ortodontia, Endodontia..."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                            id="telefone"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="email@exemplo.com"
                        />
                    </div>

                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.ativo ? "active" : "inactive"}
                            onValueChange={(v) => setFormData({ ...formData, ativo: v === "active" })}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="col-span-2"
                >
                    {loading ? "Salvando..." : "Salvar"}
                </Button>
            </div>
        </form>
    )
}