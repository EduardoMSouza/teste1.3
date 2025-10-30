"use client"

import { Bell, Search, Settings } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { motion } from "framer-motion"
import { useState } from "react"

export function Header() {
  const [searchFocus, setSearchFocus] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <motion.div
            animate={{
              scale: searchFocus ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                searchFocus ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
              }`}
            />
            <input
              type="text"
              placeholder="Buscar pacientes, prontuários, agendamentos..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all duration-300 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none ${
                searchFocus
                  ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            />
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 group"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300 group"
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
          </motion.button>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-2" />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/30">
              DR
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Dr. Usuário</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Médico</div>
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  )
}
