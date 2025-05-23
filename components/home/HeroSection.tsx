"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, BarChart2, Mail, Cloud, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("sobre")
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Variantes de animação
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  const floatingVariants = {
    initial: { y: 0 },
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  const circleVariants = {
    initial: { scale: 0.95, opacity: 0.9 },
    pulse: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 2.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  }

  const iconVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3 + i * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Linhas geométricas */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-700 to-transparent opacity-30"></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-700 to-transparent opacity-30"></div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-200 dark:via-blue-700 to-transparent opacity-30"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-blue-200 dark:via-blue-700 to-transparent opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Conteúdo de texto */}
          <motion.div className="w-full lg:w-3/5" variants={itemVariants}>
            <motion.div
              className="inline-block px-4 py-1 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800"
              variants={itemVariants}
            >
              <span className="text-sm font-medium text-[#4072b0] dark:text-[#6b91c1]">
                Agência de Marketing Digital
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white"
              variants={itemVariants}
            >
              Transformamos sua
              <span className="relative inline-block mx-2">
                <span className="relative z-10 text-[#4b7bb5] dark:text-[#6b91c1]">presença</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg -z-0"></span>
              </span>
              digital em
              <span className="relative inline-block mx-2">
                <span className="relative z-10 text-[#4b7bb5] dark:text-[#6b91c1]">resultados</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg -z-0"></span>
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
              variants={itemVariants}
            >
              Estratégias personalizadas de marketing digital que impulsionam seu negócio com criatividade, dados e
              resultados mensuráveis.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 mb-8" variants={itemVariants}>
              <Button
                size="lg"
                className="bg-[#4072b0] hover:bg-[#3d649e] text-white dark:bg-[#4b7bb5] dark:hover:bg-[#6b91c1] rounded-lg px-8"
                onClick={() => scrollToNextSection()}
              >
                Conheça Nossos Serviços
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-[#4b7bb5] text-[#4b7bb5] hover:bg-[#4b7bb5]/10 dark:border-[#6b91c1] dark:text-[#6b91c1] dark:hover:bg-[#6b91c1]/10 rounded-lg px-8"
                onClick={() => {
                  const contactSection = document.getElementById("contato")
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Fale Conosco
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
              variants={itemVariants}
            >
              <span>Descubra mais</span>
              <motion.div
                animate={{
                  y: [0, 5, 0],
                  transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
                }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Elemento visual abstrato */}
          <motion.div className="w-full lg:w-2/5 relative h-[400px] md:h-[500px]" variants={itemVariants}>
            {/* Círculos concêntricos */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-[#4b7bb5]/20 dark:border-[#6b91c1]/20"
              initial="initial"
              animate="pulse"
              variants={circleVariants}
            ></motion.div>

            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-[#4b7bb5]/30 dark:border-[#6b91c1]/30"
              initial="initial"
              animate="pulse"
              variants={circleVariants}
              custom={1.2}
            ></motion.div>

            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-[#4b7bb5]/40 dark:border-[#6b91c1]/40"
              initial="initial"
              animate="pulse"
              variants={circleVariants}
              custom={1.4}
            ></motion.div>

            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#4b7bb5] to-[#3d649e] dark:from-[#6b91c1] dark:to-[#4b7bb5] opacity-90"
              initial="initial"
              animate="pulse"
              variants={circleVariants}
              custom={1.6}
            ></motion.div>

            {/* Ícones flutuantes */}
            <motion.div
              className="absolute top-[15%] left-[25%] p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg"
              initial="initial"
              animate="float"
              variants={floatingVariants}
              custom={0}
            >
              <motion.div initial="initial" animate="animate" variants={iconVariants} custom={0}>
                <BarChart2 className="w-6 h-6 text-[#4b7bb5] dark:text-[#6b91c1]" />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute top-[70%] left-[20%] p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg"
              initial="initial"
              animate="float"
              variants={floatingVariants}
              custom={1}
            >
              <motion.div initial="initial" animate="animate" variants={iconVariants} custom={1}>
                <Mail className="w-6 h-6 text-[#4b7bb5] dark:text-[#6b91c1]" />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute top-[25%] right-[20%] p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg"
              initial="initial"
              animate="float"
              variants={floatingVariants}
              custom={2}
            >
              <motion.div initial="initial" animate="animate" variants={iconVariants} custom={2}>
                <Cloud className="w-6 h-6 text-[#4b7bb5] dark:text-[#6b91c1]" />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute top-[60%] right-[25%] p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg"
              initial="initial"
              animate="float"
              variants={floatingVariants}
              custom={3}
            >
              <motion.div initial="initial" animate="animate" variants={iconVariants} custom={3}>
                <TrendingUp className="w-6 h-6 text-[#4b7bb5] dark:text-[#6b91c1]" />
              </motion.div>
            </motion.div>

            {/* Estatística flutuante */}
            <motion.div
              className="absolute top-[40%] right-[30%] p-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
              initial="initial"
              animate="float"
              variants={floatingVariants}
              custom={4}
            >
              <motion.div initial="initial" animate="animate" variants={iconVariants} custom={4}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#4072b0] dark:text-[#6b91c1]">+300%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">ROI Médio</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Divisor de onda minimalista */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-[30px] md:h-[50px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0Z"
            className="fill-white dark:fill-gray-900"
          ></path>
        </svg>
      </div>
    </section>
  )
}
