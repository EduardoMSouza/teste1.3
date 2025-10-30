import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

export default function Todos() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:8080/pacientes");
                setPatients(response.data);
                toast.success(`${response.data.length} pacientes carregados!`);
            } catch (error) {
                toast.error("Erro ao carregar pacientes.");
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-7xl mx-auto"
        >
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Todos os Pacientes</h1>
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8"
            >
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-t-sky-500 rounded-full"
                        />
                    </div>
                ) : patients.length === 0 ? (
                    <p className="text-center text-slate-500 dark:text-slate-400">Nenhum paciente cadastrado.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {patients.map((patient) => (
                            <motion.div
                                key={patient.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
                            >
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{patient.nome}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">CPF: {patient.cpf}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Email: {patient.email}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}