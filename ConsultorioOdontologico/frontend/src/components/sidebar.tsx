"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Zap, ChevronDown } from "lucide-react"
import { menuItems } from "./MenuItems.jsx"
import { motion, AnimatePresence } from "framer-motion"

export function Sidebar() {
  const [open, setOpen] = useState(null)

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xl">
      <div className="p-6 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-11 h-11 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
            <Zap className="w-6 h-6 text-white relative z-10" strokeWidth={2.5} />
          </motion.div>
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
              Consultório
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sistema Médico</div>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {!item.children && (
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                                    group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300
                                    ${
                                      isActive
                                        ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-md hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50"
                                    }
                                `}
              >
                {({ isActive }) => (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={`relative z-10 ${isActive ? "text-white" : "text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"} transition-colors duration-300`}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="font-semibold text-[15px] relative z-10 tracking-tight">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-2xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-indigo-600/0 to-violet-600/0 group-hover:from-blue-600/5 group-hover:via-indigo-600/5 group-hover:to-violet-600/5 rounded-2xl transition-all duration-300" />
                    )}
                  </>
                )}
              </NavLink>
            )}

            {item.children && (
              <div>
                <motion.button
                  onClick={() => setOpen(open === item.id ? null : item.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full group relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800/60 hover:shadow-md hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                    >
                      {item.icon}
                    </motion.div>
                    <span className="font-semibold text-[15px] tracking-tight">{item.name}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: open === item.id ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown
                      className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                      strokeWidth={2.5}
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-indigo-600/0 to-violet-600/0 group-hover:from-blue-600/5 group-hover:via-indigo-600/5 group-hover:to-violet-600/5 rounded-2xl transition-all duration-300" />
                </motion.button>

                <AnimatePresence initial={false}>
                  {open === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="pl-6 pt-2 space-y-1 overflow-hidden"
                    >
                      {item.children.map((child, childIndex) => (
                        <motion.div
                          key={child.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: childIndex * 0.05 }}
                        >
                          <NavLink
                            to={child.path}
                            className={({ isActive }) => `
                                                            group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300
                                                            ${
                                                              isActive
                                                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 text-blue-700 dark:text-blue-400 shadow-sm"
                                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200"
                                                            }
                                                        `}
                          >
                            {({ isActive }) => (
                              <>
                                <motion.span
                                  whileHover={{ scale: 1.3 }}
                                  className={`w-2 h-2 rounded-full relative z-10 transition-all duration-300 ${
                                    isActive
                                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50"
                                      : "bg-slate-400 dark:bg-slate-600 group-hover:bg-blue-500 dark:group-hover:bg-blue-400"
                                  }`}
                                />
                                <span className="font-medium relative z-10">{child.name}</span>
                                {isActive && (
                                  <motion.div
                                    layoutId={`subActiveIndicator-${item.id}`}
                                    className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                  />
                                )}
                              </>
                            )}
                          </NavLink>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-slate-100/80 to-slate-50/80 dark:from-slate-800/60 dark:to-slate-900/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
            DR
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">Dr. Usuário</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">Médico Responsável</div>
          </div>
        </div>
      </div>
    </div>
  )
}
