"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit, ArrowLeft, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import PatientForm from "@/components/ui/PatientForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

export default function AtualizarPacientePage() {
  const params = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

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

  const handleSubmit = async (patientData) => {
    try {
      setSubmitting(true)
      await api.updatePatient(params.id, patientData)
      toast.success("Paciente atualizado com sucesso!")
      router.push(`/pacientes/${params.id}`)
    } catch (error) {
      toast.error("Erro ao atualizar paciente")
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados do paciente...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href={`/pacientes/${params.id}`}>
          <Button variant="ghost" className="mb-6 hover:bg-white/50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Editar Paciente
            </h1>
          </div>
          <p className="text-muted-foreground ml-[60px]">Atualize os dados do paciente {patient?.nome}</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <PatientForm initialData={patient} onSubmit={handleSubmit} loading={submitting} isEditing />
        </motion.div>
      </motion.div>
    </div>
  )
}
