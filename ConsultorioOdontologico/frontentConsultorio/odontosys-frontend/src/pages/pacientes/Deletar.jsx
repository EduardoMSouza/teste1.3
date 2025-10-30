import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function Deletar() {
    const [patients, setPatients] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get("http://localhost:8080/pacientes");
                setPatients(response.data);
            } catch (error) {
                toast.error("Erro ao carregar pacientes.");
            }
        };
        fetchPatients();
    }, []);

    const handleDelete = async () => {
        if (!selectedId) return toast.error("Selecione um paciente.");
        if (!window.confirm("Confirma a exclusão?")) return;
        try {
            await axios.delete(`http://localhost:8080/pacientes/${selectedId}`);
            setPatients(patients.filter((p) => p.id !== parseInt(selectedId)));
            setSelectedId("");
            toast.success("Paciente deletado com sucesso!");
            navigate("/pacientes/todos");
        } catch (error) {
            toast.error("Erro ao deletar paciente.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-4xl mx-auto"
        >
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Deletar Paciente</h1>
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8"
            >
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all mb-6"
                >
                    <option value="">Selecione um paciente</option>
                    {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                            {patient.nome} (CPF: {patient.cpf})
                        </option>
                    ))}
                </select>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all font-semibold"
                    disabled={!selectedId}
                >
                    Deletar Paciente
                </motion.button>
            </motion.div>
        </motion.div>
    );
}