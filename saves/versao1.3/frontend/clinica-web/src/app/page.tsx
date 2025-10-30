export default function Home() {
    return (
        <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Bem-vindo ao DentalApp
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Sistema de gestão odontológica
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                            Agendamentos
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Gerencie consultas e agendamentos dos pacientes
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                            Pacientes
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Cadastro e histórico de pacientes
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                            Dentistas
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Gerencie a equipe de dentistas
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Resumo do Dia
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Consultas hoje</span>
                            <span className="font-semibold text-gray-900 dark:text-white">5</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">Pacientes atendidos</span>
                            <span className="font-semibold text-gray-900 dark:text-white">3</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 dark:text-gray-400">Próxima consulta</span>
                            <span className="font-semibold text-gray-900 dark:text-white">14:30</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}