import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/white-logo-integration.png"
                alt="Integrare"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-300">Marketing de Qualidade baseado em evidências científicas.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="text-gray-300 hover:text-white">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-300 hover:text-white">
                  Portfólio
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-gray-300 hover:text-white">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-white">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[#4b7bb5]" />
                <span>Rua Exemplo, 123 - São Paulo, SP</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#4b7bb5]" />
                <span>(11) 1234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#4b7bb5]" />
                <span>contato@integrare.com.br</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Redes Sociais</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Integrare. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
