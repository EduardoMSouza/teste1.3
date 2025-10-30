"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Calendar, MapPin, FileText, Save, X } from "lucide-react"

export function PatientForm({ patient = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nome: patient?.nome || "",
    email: patient?.email || "",
    telefone: patient?.telefone || "",
    dataNascimento: patient?.dataNascimento || "",
    endereco: patient?.endereco || "",
    observacoes: patient?.observacoes || "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const inputFields = [
    { name: "nome", label: "Nome Completo", icon: User, type: "text", placeholder: "Digite o nome completo" },
    { name: "email", label: "E-mail", icon: Mail, type: "email", placeholder: "exemplo@email.com" },
    { name: "telefone", label: "Telefone", icon: Phone, type: "tel", placeholder: "(00) 00000-0000" },
    { name: "dataNascimento", label: "Data de Nascimento", icon: Calendar, type: "date" },
    { name: "endereco", label: "Endereço", icon: MapPin, type: "text", placeholder: "Rua, número, bairro, cidade" },
  ]

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputFields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={field.name === "endereco" ? "md:col-span-2" : ""}
          >
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{field.label}</label>
            <div className="relative group">
              <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-300" />
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Observações</label>
        <div className="relative group">
          <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors duration-300" />
          <textarea
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            placeholder="Informações adicionais sobre o paciente..."
            rows={4}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300 resize-none"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-4 pt-4"
      >
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {loading ? "Salvando..." : patient ? "Atualizar Paciente" : "Cadastrar Paciente"}
        </motion.button>
        {onCancel && (
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </motion.div>
    </motion.form>
  )
}
