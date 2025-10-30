"use client"

import { BrowserRouter } from "react-router-dom"
import { Sidebar } from "../components/sidebar"

export default function Page() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <div className="w-80 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Bem-vindo ao Sistema</h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Navegue pelo menu lateral para explorar todas as funcionalidades
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pacientes Ativos</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">1,234</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">+12% em relação ao mês anterior</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Consultas Hoje</h3>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">28</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">15 concluídas, 13 pendentes</p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Taxa de Satisfação</h3>
                <p className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-2">98%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Baseado em 456 avaliações</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}
