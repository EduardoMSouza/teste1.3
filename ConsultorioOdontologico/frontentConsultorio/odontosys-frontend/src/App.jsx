import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Layout/Sidebar.jsx";
// 1. Importar o Header
import { Header } from "./components/Layout/Header.jsx"; // Ajuste o caminho se necessário

// Páginas
import Dashboard from "./components/pages/Dashboard.jsx";
import Analytics from "./components/pages/Analytics.jsx";
import Users from "./components/pages/Users.jsx";
import Ecommerce from "./components/pages/Ecommerce.jsx";
import Messages from "./components/pages/Messages.jsx";
import Reports from "./components/pages/Reports.jsx";
import Settings from "./components/pages/Settings.jsx";

function App() {
    return (
        <Router>
            {/* Adicionado dark mode ao fundo para consistência */}
            <div className="min-h-screen flex bg-gray-50 ">
                {/* Sidebar */}
                <Sidebar />

                {/* 2. Conteúdo principal agora é um container flex-col */}
                {/* h-screen e overflow-hidden evitam barras de rolagem duplas */}
                <div className="flex-1 flex flex-col h-screen overflow-hidden">

                    {/* 3. Adicionado o componente Header */}
                    <Header />

                    {/* 4. Conteúdo da página agora dentro de <main> para controlar o scroll */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/ecommerce" element={<Ecommerce />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;