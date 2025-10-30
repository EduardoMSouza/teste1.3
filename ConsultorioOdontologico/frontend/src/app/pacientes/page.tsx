"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Search, Plus, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import PatientList from "@/components/ui/PatientList"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { toast } from "sonner"

export default function TodosPacientesPage() {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(
        (patient) =>
          patient.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.cpf?.includes(searchTerm) ||
          patient.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPatients(filtered)
    } else {
      setFilteredPatients(patients)
    }
  }, [searchTerm, patients])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const data = await api.getAllPatients()
      setPatients(data)
      setFilteredPatients(data)
      toast.success("Pacientes carregados com sucesso!")
    } catch (error) {
      toast.error("Erro ao carregar pacientes")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.deletePatient(id)
      toast.success("Paciente deletado com sucesso!")
      loadPatients()
    } catch (error) {
      toast.error("Erro ao deletar paciente")
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Todos os Pacientes
            </h1>
          </div>
          <p className="text-muted-foreground ml-[60px]">Gerencie todos os pacientes cadastrados no sistema</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400"
            />
          </div>
          <Link href="/pacientes/cadastrar">
            <Button className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg">
              <Plus className="w-5 h-5 mr-2" />
              Novo Paciente
            </Button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando pacientes...</p>
            </div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 p-12 text-center"
          >
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Nenhum paciente encontrado</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? "Tente ajustar sua busca" : "Comece cadastrando um novo paciente"}
            </p>
            {!searchTerm && (
              <Link href="/pacientes/cadastrar">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Cadastrar Primeiro Paciente
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <PatientList patients={filteredPatients} onDelete={handleDelete} />
        )}
      </motion.div>
    </div>
  )
}
