"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, ArrowLeft, Edit, Trash2, Loader2, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function BuscarPacientePage() {
  const params = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadPatient()
    }
  }, [params.id])

  const loadPatient = async () => {
    try {
      setLoading(true)
      const data = await api.getPatientById(params.id)
      setPatient(data)
    } catch (error) {
      toast.error("Paciente não encontrado")
      router.push("/pacientes")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja deletar este paciente?")) {
      try {
        await api.deletePatient(params.id)
        toast.success("Paciente deletado com sucesso!")
        router.push("/pacientes")
      } catch (error) {
        toast.error("Erro ao deletar paciente")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados do paciente...</p>
        </div>
      </div>
    )
  }

  if (!patient) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/pacientes">
          <Button variant="ghost" className="mb-6 hover:bg-white/50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {patient.nome}
                </h1>
                <p className="text-muted-foreground">Detalhes do paciente</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/pacientes/${params.id}/editar`}>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Deletar
              </Button>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="grid gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Informações Pessoais
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Nome Completo</label>
                <p className="font-medium">{patient.nome}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">CPF</label>
                <p className="font-medium">{patient.cpf}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Data de Nascimento</label>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  {patient.dataNascimento}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Gênero</label>
                <p className="font-medium">{patient.genero}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-500" />
              Contato
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-500" />
                  {patient.email}
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Telefone</label>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  {patient.telefone}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-100">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-500" />
              Endereço
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Rua</label>
                <p className="font-medium">{patient.endereco?.rua}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Número</label>
                <p className="font-medium">{patient.endereco?.numero}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Cidade</label>
                <p className="font-medium">{patient.endereco?.cidade}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Estado</label>
                <p className="font-medium">{patient.endereco?.estado}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">CEP</label>
                <p className="font-medium">{patient.endereco?.cep}</p>
              </div>
            </div>
          </Card>

          {patient.observacoes && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Observações
              </h2>
              <p className="text-muted-foreground">{patient.observacoes}</p>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  )
}
