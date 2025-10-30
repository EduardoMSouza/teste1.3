"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { Trash2, AlertTriangle, User } from "lucide-react"

export default function Deletar() {
    const [patients, setPatients] = useState([])
    const [selectedId, setSelectedId] = useState("")
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:8080/pacientes")
                setPatients(response.data)
            } catch (error) {
                toast.error("Erro ao carregar pacientes.")
            }
        }
        fetchPatients()
    }, [])

    useEffect(() => {
        if (selectedId) {
            const patient = patients.find((p) => p.id === Number.parseInt(selectedId))
            setSelectedPatient(patient)
        } else {
            setSelectedPatient(null)
        }
    }, [selectedId, patients])

    const handleDelete = async () => {
        if (!selectedId) return toast.error("Selecione um paciente.")
        if (!window.confirm("Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.")) return

        setIsDeleting(true)
        try {
            await axios.delete(`http://localhost:8080/pacientes/${selectedId}`)
            setPatients(patients.filter((p) => p.id !== Number.parseInt(selectedId)))
            setSelectedId("")
            toast.success("Paciente deletado com sucesso!")
            navigate("/pacientes/todos")
        } catch (error) {
            toast.error("Erro ao deletar paciente.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-4xl mx-auto p-6 lg:p-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-destructive/10 rounded-xl">
                            <Trash2 className="w-8 h-8 text-destructive" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-foreground">Deletar Paciente</h1>
                            <p className="text-muted-foreground mt-1">Remova permanentemente um paciente do sistema</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
                >
                    <div className="p-8">
                        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-destructive">Atenção: Ação Irreversível</p>
                                <p className="text-xs text-destructive/80 mt-1">
                                    Esta ação não pode ser desfeita. Todos os dados do paciente serão permanentemente removidos.
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-foreground mb-2">Selecione o Paciente</label>
                            <select
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive/50 transition-all text-foreground appearance-none cursor-pointer"
                            >
                                <option value="">Escolha um paciente para deletar</option>
                                {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.nome} (CPF: {patient.cpf})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedPatient && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-6 bg-muted/50 border border-border rounded-xl"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6 text-destructive" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground mb-2">{selectedPatient.nome}</h3>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <p>CPF: {selectedPatient.cpf}</p>
                                            <p>Email: {selectedPatient.email}</p>
                                            {selectedPatient.celular && <p>Celular: {selectedPatient.celular}</p>}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: selectedId ? 1.02 : 1 }}
                            whileTap={{ scale: selectedId ? 0.98 : 1 }}
                            onClick={handleDelete}
                            disabled={!selectedId || isDeleting}
                            className="w-full py-4 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-destructive/20"
                        >
                            {isDeleting ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full"
                                    />
                                    Deletando...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5" />
                                    Deletar Paciente
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
