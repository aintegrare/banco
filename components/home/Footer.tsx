import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-[#3d649e] dark:bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-integrare-white.png" alt="Integrare Logo" className="h-8" />
            </div>
            <p className="text-sm text-white/80 dark:text-white/70">
              Agência de marketing digital especializada em estratégias baseadas em evidências para impulsionar seu
              negócio.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/redeintegrare"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/redeintegrare"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/redeintegrare"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/redeintegrare"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">Links Rápidos</h3>
            <ul className="space-y-3 text-sm text-white/80 dark:text-white/70">
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">
                  Serviços
                </a>
              </li>
              <li>
                <a href="#resultados" className="hover:text-white transition-colors">
                  Cases
                </a>
              </li>
              <li>
                <a href="#clientes" className="hover:text-white transition-colors">
                  Clientes
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-white transition-colors">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="https://www.redeintegrare.com/blog" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-white transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Serviços</h3>
            <ul className="space-y-3 text-sm text-white/80 dark:text-white/70">
              <li>Marketing Digital</li>
              <li>Gestão de Redes Sociais</li>
              <li>Criação de Conteúdo</li>
              <li>Análise de Dados</li>
              <li>Tráfego Pago</li>
              <li>Consultoria Estratégica</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-white/80 dark:text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@redeintegrare.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP - Brasil</span>
              </li>
            </ul>
            <div className="mt-6">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 w-full">
                Inscreva-se na Newsletter
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-sm text-white/60 dark:text-white/50">
          <p>© {new Date().getFullYear()} Integrare. Todos os direitos reservados.</p>
          <p className="mt-2">
            <a href="https://www.redeintegrare.com" className="hover:text-white transition-colors">
              www.redeintegrare.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
