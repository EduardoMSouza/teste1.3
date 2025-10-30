"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserPlus, ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import PatientForm from "@/components/ui/PatientForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CadastrarPacientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (patientData) => {
    try {
      setLoading(true)
      await api.createPatient(patientData)
      toast.success("Paciente cadastrado com sucesso!")
      router.push("/pacientes")
    } catch (error) {
      toast.error("Erro ao cadastrar paciente")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Cadastrar Paciente
            </h1>
          </div>
          <p className="text-muted-foreground ml-[60px]">Preencha os dados para cadastrar um novo paciente</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <PatientForm onSubmit={handleSubmit} loading={loading} />
        </motion.div>
      </motion.div>
    </div>
  )
}
