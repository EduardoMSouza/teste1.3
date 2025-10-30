// Sample Agenda.jsx - Conteúdo placeholder para Agenda. Crie arquivo em src/pages/Agenda.jsx
export function AgendaPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">📅 Agenda de Consultas</h2>
                <p className="text-gray-600 mb-6">Visualize e gerencie os horários do dia.</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl text-center">
                        <h3 className="text-lg font-semibold text-blue-700">Hoje</h3>
                        <p className="text-2xl font-bold text-blue-600">18/10</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl text-center">
                        <h3 className="text-lg font-semibold text-green-700">Consultas Marcadas</h3>
                        <p className="text-2xl font-bold text-green-600">5</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl text-center">
                        <h3 className="text-lg font-semibold text-yellow-700">Pendentes</h3>
                        <p className="text-2xl font-bold text-yellow-600">2</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl text-center">
                        <h3 className="text-lg font-semibold text-purple-700">Concluídas</h3>
                        <p className="text-2xl font-bold text-purple-600">3</p>
                    </div>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors">
                    + Nova Consulta
                </button>
            </div>
            {/* Aqui você pode integrar um calendário como react-big-calendar */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Horários do Dia</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium">09:00 - João Silva</h4>
                        <p className="text-sm text-gray-500">Limpeza</p>
                    </div>
                    {/* Mais itens */}
                </div>
            </div>
        </div>
    );
}