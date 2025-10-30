// Updated Dashboard.jsx - Now acts as a layout component with Header, Sidebar, and Outlet for main content
import { useAuth } from '../../config/AuthContext'; // Ajuste o caminho se necessário
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '../Header.jsx'; // Ajuste o caminho se necessário
import { Sidebar } from '../Sidebar'; // Ajuste o caminho se necessário

export function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Adicione um handler para logout no Header também, se quiser
    const handleHeaderLogout = () => {
        handleLogout();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            {/*<Header onLogout={handleHeaderLogout} />*/}

            {/* Main Layout: Flex para Sidebar e Conteúdo */}
            <div className="flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <main className="flex-1 p-6 lg:p-8">
                    {/* Aqui carrega o conteúdo dinâmico via <Outlet /> */}
                    <Outlet />

                    {/* Fallback se não houver rota filha */}
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bem-vindo ao Dashboard!</h1>
                        <p className="text-gray-600 mb-6">Olá, {user?.email}!</p>
                        {/* Botão de logout como fallback, mas remova quando usar rotas */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}