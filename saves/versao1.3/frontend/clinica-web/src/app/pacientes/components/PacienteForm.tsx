// app/pacientes/components/PacienteForm.tsx
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { formatadores } from "@/lib/formatadores"

interface PacienteFormData {
    nome: string
    cpf?: string
    rg?: string
    email?: string
    telefone?: string
    dataNascimento?: string
    sexo?: 'MASCULINO' | 'FEMININO' | 'OUTRO'
    estadoCivil?: string
    profissao?: string
    naturalidade?: string
    nacionalidade?: string
    convenio?: string
    numeroCarteirinha?: string
    endereco?: {
        logradouro?: string
        numero?: string
        complemento?: string
        bairro?: string
        cidade?: string
        estado?: string
        cep?: string
    }
    contatoEmergencia?: {
        nome?: string
        telefone?: string
        parentesco?: string
    }
    responsavel?: {
        nome?: string
        telefone?: string
    }
    indicadoPor?: string
    observacoesGerais?: string
}

interface PacienteFormProps {
    pacienteEdit?: any
    onSubmit: (data: PacienteFormData) => void
    loading?: boolean
}

export default function PacienteForm({
                                         pacienteEdit,
                                         onSubmit,
                                         loading
                                     }: PacienteFormProps) {
    const [formData, setFormData] = useState<PacienteFormData>({
        nome: '',
        cpf: '',
        rg: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        sexo: undefined,
        estadoCivil: '',
        profissao: '',
        naturalidade: '',
        nacionalidade: '',
        convenio: '',
        numeroCarteirinha: '',
        endereco: {
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: ''
        },
        contatoEmergencia: {
            nome: '',
            telefone: '',
            parentesco: ''
        },
        responsavel: {
            nome: '',
            telefone: ''
        },
        indicadoPor: '',
        observacoesGerais: ''
    })

    // Preencher formulário quando editar
    useEffect(() => {
        if (pacienteEdit) {
            setFormData({
                nome: pacienteEdit.nome || '',
                cpf: pacienteEdit.cpf || '',
                rg: pacienteEdit.rg || '',
                email: pacienteEdit.email || '',
                telefone: pacienteEdit.telefone || '',
                dataNascimento: formatadores.dataDoBackend(pacienteEdit.dataNascimento) || '',
                sexo: pacienteEdit.sexo || '',
                estadoCivil: pacienteEdit.estadoCivil || '',
                profissao: pacienteEdit.profissao || '',
                naturalidade: pacienteEdit.naturalidade || '',
                nacionalidade: pacienteEdit.nacionalidade || '',
                convenio: pacienteEdit.convenio || '',
                numeroCarteirinha: pacienteEdit.numeroCarteirinha || '',
                endereco: pacienteEdit.endereco || {},
                contatoEmergencia: pacienteEdit.contatoEmergencia || {},
                responsavel: pacienteEdit.responsavel || {},
                indicadoPor: pacienteEdit.indicadoPor || '',
                observacoesGerais: pacienteEdit.observacoesGerais || ''
            })
        }
    }, [pacienteEdit])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Preparar dados para a API - remover campos vazios
        const dadosParaEnviar: PacienteFormData = {
            nome: formData.nome,
            ...(formData.cpf && { cpf: formData.cpf }),
            ...(formData.rg && { rg: formData.rg }),
            ...(formData.email && { email: formData.email }),
            ...(formData.telefone && { telefone: formData.telefone }),
            ...(formData.dataNascimento && {
                dataNascimento: formatadores.dataParaBackend(formData.dataNascimento)
            }),
            ...(formData.sexo && { sexo: formData.sexo }),
            ...(formData.estadoCivil && { estadoCivil: formData.estadoCivil }),
            ...(formData.profissao && { profissao: formData.profissao }),
            ...(formData.naturalidade && { naturalidade: formData.naturalidade }),
            ...(formData.nacionalidade && { nacionalidade: formData.nacionalidade }),
            ...(formData.convenio && { convenio: formData.convenio }),
            ...(formData.numeroCarteirinha && { numeroCarteirinha: formData.numeroCarteirinha }),
            ...(formData.indicadoPor && { indicadoPor: formData.indicadoPor }),
            ...(formData.observacoesGerais && { observacoesGerais: formData.observacoesGerais }),
        }

        // Adicionar endereco apenas se houver algum campo preenchido
        const enderecoPreenchido = Object.values(formData.endereco || {}).some(val => val?.trim());
        if (enderecoPreenchido) {
            dadosParaEnviar.endereco = formData.endereco;
        }

        // Adicionar contatoEmergencia apenas se houver algum campo preenchido
        const contatoPreenchido = Object.values(formData.contatoEmergencia || {}).some(val => val?.trim());
        if (contatoPreenchido) {
            dadosParaEnviar.contatoEmergencia = formData.contatoEmergencia;
        }

        // Adicionar responsavel apenas se houver algum campo preenchido
        const responsavelPreenchido = Object.values(formData.responsavel || {}).some(val => val?.trim());
        if (responsavelPreenchido) {
            dadosParaEnviar.responsavel = formData.responsavel;
        }

        onSubmit(dadosParaEnviar)
    }

    // Handlers de formatação
    const handleCpfChange = (valor: string) => {
        const formatado = formatadores.cpf(valor)
        setFormData(prev => ({ ...prev, cpf: formatado }))
    }

    const handleTelefoneChange = (valor: string) => {
        const formatado = formatadores.telefone(valor)
        setFormData(prev => ({ ...prev, telefone: formatado }))
    }

    const handleCepChange = (valor: string) => {
        const formatado = formatadores.cep(valor)
        setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, cep: formatado }
        }))
    }

    const handleDataChange = (valor: string) => {
        const apenasNumeros = valor.replace(/\D/g, '')
        let formatado = apenasNumeros
        if (apenasNumeros.length > 2) {
            formatado = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`
        }
        if (apenasNumeros.length > 4) {
            formatado = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`
        }
        setFormData(prev => ({ ...prev, dataNascimento: formatado }))
    }

    // Handler para campos aninhados
    const handleNestedChange = (section: 'endereco' | 'contatoEmergencia' | 'responsavel', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Dados Pessoais</h3>

                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                            placeholder="Digite o nome completo"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                value={formData.cpf}
                                onChange={(e) => handleCpfChange(e.target.value)}
                                placeholder="000.000.000-00"
                                maxLength={14}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rg">RG</Label>
                            <Input
                                id="rg"
                                value={formData.rg}
                                onChange={(e) => setFormData(prev => ({ ...prev, rg: e.target.value }))}
                                placeholder="Número do RG"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                            <Input
                                id="dataNascimento"
                                value={formData.dataNascimento}
                                onChange={(e) => handleDataChange(e.target.value)}
                                placeholder="dd/mm/aaaa"
                                maxLength={10}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sexo">Sexo</Label>
                            <Select
                                value={formData.sexo}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, sexo: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MASCULINO">Masculino</SelectItem>
                                    <SelectItem value="FEMININO">Feminino</SelectItem>
                                    <SelectItem value="OUTRO">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="estadoCivil">Estado Civil</Label>
                            <Select
                                value={formData.estadoCivil}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, estadoCivil: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SOLTEIRO">Solteiro(a)</SelectItem>
                                    <SelectItem value="CASADO">Casado(a)</SelectItem>
                                    <SelectItem value="DIVORCIADO">Divorciado(a)</SelectItem>
                                    <SelectItem value="VIUVO">Viúvo(a)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profissao">Profissão</Label>
                            <Input
                                id="profissao"
                                value={formData.profissao}
                                onChange={(e) => setFormData(prev => ({ ...prev, profissao: e.target.value }))}
                                placeholder="Profissão do paciente"
                            />
                        </div>
                    </div>
                </div>

                {/* Contato e Convênio */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contato e Convênio</h3>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@exemplo.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                            id="telefone"
                            value={formData.telefone}
                            onChange={(e) => handleTelefoneChange(e.target.value)}
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="convenio">Convênio</Label>
                        <Input
                            id="convenio"
                            value={formData.convenio}
                            onChange={(e) => setFormData(prev => ({ ...prev, convenio: e.target.value }))}
                            placeholder="Plano de saúde"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="numeroCarteirinha">Número da Carteirinha</Label>
                        <Input
                            id="numeroCarteirinha"
                            value={formData.numeroCarteirinha}
                            onChange={(e) => setFormData(prev => ({ ...prev, numeroCarteirinha: e.target.value }))}
                            placeholder="Número da carteirinha"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="indicadoPor">Indicado Por</Label>
                        <Input
                            id="indicadoPor"
                            value={formData.indicadoPor}
                            onChange={(e) => setFormData(prev => ({ ...prev, indicadoPor: e.target.value }))}
                            placeholder="Quem indicou o paciente"
                        />
                    </div>
                </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="cep">CEP</Label>
                        <Input
                            id="cep"
                            value={formData.endereco?.cep}
                            onChange={(e) => handleCepChange(e.target.value)}
                            placeholder="00000-000"
                            maxLength={9}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="logradouro">Logradouro</Label>
                        <Input
                            id="logradouro"
                            value={formData.endereco?.logradouro}
                            onChange={(e) => handleNestedChange('endereco', 'logradouro', e.target.value)}
                            placeholder="Rua, Avenida, etc."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="numero">Número</Label>
                        <Input
                            id="numero"
                            value={formData.endereco?.numero}
                            onChange={(e) => handleNestedChange('endereco', 'numero', e.target.value)}
                            placeholder="Número"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="complemento">Complemento</Label>
                        <Input
                            id="complemento"
                            value={formData.endereco?.complemento}
                            onChange={(e) => handleNestedChange('endereco', 'complemento', e.target.value)}
                            placeholder="Complemento"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input
                            id="bairro"
                            value={formData.endereco?.bairro}
                            onChange={(e) => handleNestedChange('endereco', 'bairro', e.target.value)}
                            placeholder="Bairro"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input
                            id="cidade"
                            value={formData.endereco?.cidade}
                            onChange={(e) => handleNestedChange('endereco', 'cidade', e.target.value)}
                            placeholder="Cidade"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Input
                            id="estado"
                            value={formData.endereco?.estado}
                            onChange={(e) => handleNestedChange('endereco', 'estado', e.target.value)}
                            placeholder="UF"
                            maxLength={2}
                        />
                    </div>
                </div>
            </div>

            {/* Contato de Emergência */}
            <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Contato de Emergência</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contatoNome">Nome</Label>
                        <Input
                            id="contatoNome"
                            value={formData.contatoEmergencia?.nome}
                            onChange={(e) => handleNestedChange('contatoEmergencia', 'nome', e.target.value)}
                            placeholder="Nome do contato"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contatoTelefone">Telefone</Label>
                        <Input
                            id="contatoTelefone"
                            value={formData.contatoEmergencia?.telefone}
                            onChange={(e) => handleNestedChange('contatoEmergencia', 'telefone', e.target.value)}
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contatoParentesco">Parentesco</Label>
                        <Input
                            id="contatoParentesco"
                            value={formData.contatoEmergencia?.parentesco}
                            onChange={(e) => handleNestedChange('contatoEmergencia', 'parentesco', e.target.value)}
                            placeholder="Parentesco"
                        />
                    </div>
                </div>
            </div>

            {/* Responsável */}
            <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Responsável (para menores de idade)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="responsavelNome">Nome do Responsável</Label>
                        <Input
                            id="responsavelNome"
                            value={formData.responsavel?.nome}
                            onChange={(e) => handleNestedChange('responsavel', 'nome', e.target.value)}
                            placeholder="Nome do responsável"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="responsavelTelefone">Telefone do Responsável</Label>
                        <Input
                            id="responsavelTelefone"
                            value={formData.responsavel?.telefone}
                            onChange={(e) => handleNestedChange('responsavel', 'telefone', e.target.value)}
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                        />
                    </div>
                </div>
            </div>

            {/* Observações */}
            <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">Observações Gerais</h3>
                <Textarea
                    value={formData.observacoesGerais}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoesGerais: e.target.value }))}
                    placeholder="Observações importantes sobre o paciente"
                    rows={3}
                />
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6"
            >
                {loading ? 'Salvando...' : (pacienteEdit ? 'Atualizar Paciente' : 'Cadastrar Paciente')}
            </Button>
        </form>
    )
}