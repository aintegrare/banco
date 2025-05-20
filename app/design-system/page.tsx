"use client"

import { H1, H2, H3, H4, Paragraph, Lead, Subtle, Badge } from "@/components/design-system/typography"
import {
  Button,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  LinkButton,
  ArrowButton,
} from "@/components/design-system/buttons"
import { Card, FeatureCard, TestimonialCard, BlogCard } from "@/components/design-system/cards"
import { SectionHeader, Grid, HeroSection } from "@/components/design-system/sections"
import { Form, Input, Textarea, FormSuccess, FormError } from "@/components/design-system/forms"
import { Mail, MessageSquare, PenTool, BarChart2 } from "lucide-react"

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <H1 className="mb-8">Design System da Integrare</H1>
        <Lead className="mb-12">
          Este guia documenta os componentes, padrões e princípios de design usados no site da Integrare.
        </Lead>

        {/* Cores */}
        <section className="mb-16">
          <H2 className="mb-6">Cores</H2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <H3 className="mb-4">Cores da Marca</H3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-brand-500 flex items-end p-2">
                    <span className="text-white text-sm font-mono">brand-500</span>
                  </div>
                  <Subtle>Principal</Subtle>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-brand-600 flex items-end p-2">
                    <span className="text-white text-sm font-mono">brand-600</span>
                  </div>
                  <Subtle>Hover</Subtle>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-brand-700 flex items-end p-2">
                    <span className="text-white text-sm font-mono">brand-700</span>
                  </div>
                  <Subtle>Active</Subtle>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-brand-400 flex items-end p-2">
                    <span className="text-white text-sm font-mono">brand-400</span>
                  </div>
                  <Subtle>Accent</Subtle>
                </div>
              </div>
            </div>
            <div>
              <H3 className="mb-4">Cores Neutras</H3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-neutral-100 flex items-end p-2">
                    <span className="text-neutral-800 text-sm font-mono">neutral-100</span>
                  </div>
                  <Subtle>Background Light</Subtle>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-neutral-900 flex items-end p-2">
                    <span className="text-white text-sm font-mono">neutral-900</span>
                  </div>
                  <Subtle>Background Dark</Subtle>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-neutral-700 flex items-end p-2">
                    <span className="text-white text-sm font-mono">neutral-700</span>
                  </div>
                  <Subtle>Text Dark</Subtle>
                </div>
                <div className="space-y-2">
                  <div className="h-16 rounded-md bg-neutral-300 flex items-end p-2">
                    <span className="text-neutral-800 text-sm font-mono">neutral-300</span>
                  </div>
                  <Subtle>Border</Subtle>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tipografia */}
        <section className="mb-16">
          <H2 className="mb-6">Tipografia</H2>
          <div className="space-y-8">
            <div>
              <H3 className="mb-4">Headings</H3>
              <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
                <H1>Heading 1</H1>
                <H2>Heading 2</H2>
                <H3>Heading 3</H3>
                <H4>Heading 4</H4>
              </div>
            </div>
            <div>
              <H3 className="mb-4">Parágrafos</H3>
              <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
                <Lead>
                  Lead Paragraph: Texto maior usado para introduções e destaques. Marketing não é apenas sobre vender
                  mais, é sobre ter propósito e mostrar isso para o mundo.
                </Lead>
                <Paragraph>
                  Paragraph: Texto padrão para conteúdo. Fundada em 2020, a Integrare nasceu com a missão de levar
                  Marketing de Qualidade, baseado em evidências científicas e casos práticos de sucesso. Começamos
                  oferecendo serviços simples de gestão de social media e hoje oferecemos um ecossistema completo de
                  serviços de marketing.
                </Paragraph>
                <Subtle>
                  Subtle: Texto menor usado para informações secundárias, como datas, legendas e notas de rodapé.
                </Subtle>
              </div>
            </div>
            <div>
              <H3 className="mb-4">Elementos de Texto</H3>
              <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
                <Badge>Badge</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Botões */}
        <section className="mb-16">
          <H2 className="mb-6">Botões</H2>
          <div className="space-y-8">
            <div>
              <H3 className="mb-4">Variantes</H3>
              <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
                <PrimaryButton>Primary</PrimaryButton>
                <SecondaryButton>Secondary</SecondaryButton>
                <OutlineButton>Outline</OutlineButton>
                <GhostButton>Ghost</GhostButton>
                <LinkButton>Link</LinkButton>
              </div>
            </div>
            <div>
              <H3 className="mb-4">Tamanhos</H3>
              <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div>
              <H3 className="mb-4">Estados</H3>
              <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button isLoading>Loading</Button>
              </div>
            </div>
            <div>
              <H3 className="mb-4">Com Ícones</H3>
              <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-6 rounded-lg">
                <Button icon={<Mail className="h-4 w-4" />}>Icon Left</Button>
                <Button icon={<Mail className="h-4 w-4" />} iconPosition="right">
                  Icon Right
                </Button>
                <ArrowButton>Arrow Button</ArrowButton>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mb-16">
          <H2 className="mb-6">Cards</H2>
          <div className="space-y-8">
            <div>
              <H3 className="mb-4">Card Básico</H3>
              <Card className="max-w-md">
                <div className="p-6">
                  <H4 className="mb-2">Card Title</H4>
                  <Paragraph>Este é um card básico que pode ser usado para diversos tipos de conteúdo.</Paragraph>
                </div>
              </Card>
            </div>
            <div>
              <H3 className="mb-4">Feature Card</H3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard
                  icon={<MessageSquare className="h-5 w-5" />}
                  title="Gestão de Mídias Sociais"
                  description="Criação estratégica de conteúdo e gestão de comunidades para construir a presença da sua marca."
                />
                <FeatureCard
                  icon={<PenTool className="h-5 w-5" />}
                  title="Marketing de Conteúdo"
                  description="Conteúdo convincente que estabelece sua autoridade e constrói confiança com seus clientes."
                />
                <FeatureCard
                  icon={<BarChart2 className="h-5 w-5" />}
                  title="Análise de Dados"
                  description="Monitoramento e análise de métricas para otimizar campanhas e maximizar o ROI."
                />
              </div>
            </div>
            <div>
              <H3 className="mb-4">Testimonial Card</H3>
              <TestimonialCard
                quote="A Integrare transformou nossa presença digital. Sua abordagem estratégica para mídias sociais e marketing de conteúdo aumentou significativamente nossa conscientização de marca e geração de leads."
                author="Carlos Silva"
                role="Diretor de Marketing, Empresa de Tecnologia"
                className="max-w-md"
              />
            </div>
            <div>
              <H3 className="mb-4">Blog Card</H3>
              <BlogCard
                image="/digital-marketing-concept.png"
                title="Como aumentar suas conversões em 200% com marketing de conteúdo"
                excerpt="Descubra as estratégias que utilizamos para aumentar as conversões dos nossos clientes através de conteúdo estratégico."
                category="Marketing de Conteúdo"
                date="12 Mai 2023"
                className="max-w-md"
              />
            </div>
          </div>
        </section>

        {/* Seções */}
        <section className="mb-16">
          <H2 className="mb-6">Seções</H2>
          <div className="space-y-8">
            <div>
              <H3 className="mb-4">Section Header</H3>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <SectionHeader
                  title="Nossos Serviços"
                  description="Oferecemos um ecossistema completo de serviços de marketing digital para impulsionar seu negócio com estratégias personalizadas e resultados mensuráveis."
                />
              </div>
            </div>
            <div>
              <H3 className="mb-4">Grid</H3>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                <Grid columns={3} gap="md">
                  <div className="bg-brand-100 dark:bg-brand-900/30 p-4 rounded-lg text-center">Item 1</div>
                  <div className="bg-brand-100 dark:bg-brand-900/30 p-4 rounded-lg text-center">Item 2</div>
                  <div className="bg-brand-100 dark:bg-brand-900/30 p-4 rounded-lg text-center">Item 3</div>
                </Grid>
              </div>
            </div>
          </div>
        </section>

        {/* Formulários */}
        <section className="mb-16">
          <H2 className="mb-6">Formulários</H2>
          <div className="space-y-8">
            <div>
              <H3 className="mb-4">Campos</H3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg">
                <Input label="Nome" placeholder="Seu nome completo" />
                <Input label="Email" type="email" placeholder="seu@email.com" />
                <Input label="Telefone" placeholder="(00) 00000-0000" error="Campo obrigatório" />
                <Textarea label="Mensagem" placeholder="Como podemos ajudar?" rows={4} />
              </div>
            </div>
            <div>
              <H3 className="mb-4">Formulário Completo</H3>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
                <Form onSubmit={(e) => e.preventDefault()} submitText="Enviar Mensagem">
                  <Input label="Nome" placeholder="Seu nome completo" />
                  <Input label="Email" type="email" placeholder="seu@email.com" />
                  <Textarea label="Mensagem" placeholder="Como podemos ajudar?" rows={4} />
                </Form>
              </div>
            </div>
            <div>
              <H3 className="mb-4">Mensagens de Feedback</H3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-6 rounded-lg">
                <FormSuccess message="Mensagem enviada com sucesso! Entraremos em contato em breve." />
                <FormError message="Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente." />
              </div>
            </div>
          </div>
        </section>

        {/* Exemplo de Hero Section */}
        <section className="mb-16">
          <H2 className="mb-6">Hero Section</H2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
              <HeroSection
                title="Marketing Estratégico para Resultados Reais"
                subtitle="Transformamos negócios através de estratégias de marketing baseadas em dados e focadas em resultados mensuráveis."
                ctaText="Conheça Nossa Abordagem"
                secondaryCtaText="Fale Conosco"
                image="/marketing-agency-team.png"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
