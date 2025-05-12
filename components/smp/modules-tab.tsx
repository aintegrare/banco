"use client"

import { motion } from "framer-motion"
import { Bot, Clock, AlertCircle } from "lucide-react"

export default function ModulesTab({
  selectedModule,
  setSelectedModule,
}: {
  selectedModule: string
  setSelectedModule: (id: string) => void
}) {
  return (
    <div className="bg-chat-bg rounded-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 flex-shrink-0">
        <motion.div
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-medium">Módulos</h2>
        </motion.div>
      </div>

      <div className="flex-grow overflow-y-auto scrollbar-hide">
        <div className="p-4 flex flex-col items-center justify-center h-full">
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 bg-neutral-800 rounded-full mb-4 flex items-center justify-center">
              <Bot size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Módulos Em Breve</h3>
            <p className="text-neutral-400 max-w-sm mx-auto mb-6">
              Esta seção está atualmente em desenvolvimento. Volte mais tarde para módulos disponíveis.
            </p>

            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <div className="p-3 bg-neutral-800 rounded-lg flex items-center">
                <Clock size={18} className="mr-2 text-primary" />
                <span className="text-sm">Desenvolvimento em andamento</span>
              </div>
              <div className="p-3 bg-neutral-800 rounded-lg flex items-center">
                <AlertCircle size={18} className="mr-2 text-yellow-500" />
                <span className="text-sm">Volte em breve para atualizações</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
