# Design System da Integrare

Este documento descreve o design system da Integrare, um conjunto de componentes, padrões e princípios de design que garantem consistência visual e funcional em todo o site.

## Princípios de Design

1. **Clareza**: Comunicação clara e direta, sem ambiguidades.
2. **Consistência**: Experiência coesa em todas as páginas e dispositivos.
3. **Acessibilidade**: Design inclusivo para todos os usuários.
4. **Responsividade**: Adaptação perfeita a todos os tamanhos de tela.
5. **Eficiência**: Interfaces intuitivas que facilitam a realização de tarefas.

## Paleta de Cores

### Cores da Marca

- **brand-500 (#4b7bb5)**: Cor principal da marca, usada em elementos de destaque.
- **brand-600 (#4072b0)**: Usada para estados hover de elementos interativos.
- **brand-700 (#3d649e)**: Usada para estados active de elementos interativos.
- **brand-400 (#6b91c1)**: Cor de destaque secundária, usada para acentos.

### Cores Neutras

- **neutral-100 (#f2f1ef)**: Fundo claro, usado em seções alternadas.
- **neutral-900 (#212529)**: Fundo escuro, usado no modo dark.
- **neutral-700 (#495057)**: Texto principal no modo dark.
- **neutral-300 (#dee2e6)**: Bordas e separadores.

### Cores de Feedback

- **success-500 (#4caf50)**: Feedback positivo, confirmações.
- **warning-500 (#ff9800)**: Alertas, atenção necessária.
- **error-500 (#f44336)**: Erros, ações destrutivas.
- **info-500 (#2196f3)**: Informações, dicas.

## Tipografia

### Família de Fontes

- **Principal**: Inter, sans-serif
- **Headings**: Inter, sans-serif

### Hierarquia

- **H1**: 3.75rem (60px), bold, tracking-tight
- **H2**: 3rem (48px), bold, tracking-tight
- **H3**: 2.25rem (36px), bold
- **H4**: 1.5rem (24px), bold
- **Paragraph**: 1rem (16px), normal
- **Lead**: 1.25rem (20px), normal
- **Subtle**: 0.875rem (14px), normal

## Componentes

### Botões

- **Primary**: Ação principal, cor de fundo brand-500.
- **Secondary**: Ação secundária, cor de fundo neutral-100.
- **Outline**: Ação terciária, borda brand-500.
- **Ghost**: Ação sutil, sem fundo ou borda.
- **Link**: Navegação inline, sem fundo ou borda.

### Cards

- **Card Básico**: Container para conteúdo diverso.
- **Feature Card**: Destaque de funcionalidades com ícone.
- **Testimonial Card**: Depoimentos de clientes.
- **Blog Card**: Prévia de posts do blog.

### Seções

- **Section**: Container padrão para seções da página.
- **SectionHeader**: Cabeçalho de seção com título e descrição.
- **Grid**: Sistema de grid flexível.
- **HeroSection**: Seção de destaque no topo da página.

### Formulários

- **Input**: Campo de entrada de texto.
- **Textarea**: Campo de texto multilinha.
- **Form**: Container para formulários.
- **FormSuccess**: Mensagem de sucesso.
- **FormError**: Mensagem de erro.

## Espaçamento

O sistema de espaçamento segue uma escala consistente:

- **4px (0.25rem)**: Espaçamento mínimo entre elementos relacionados.
- **8px (0.5rem)**: Espaçamento padrão entre elementos relacionados.
- **16px (1rem)**: Espaçamento entre grupos de elementos.
- **24px (1.5rem)**: Espaçamento entre seções de conteúdo.
- **32px (2rem)**: Espaçamento entre componentes maiores.
- **48px (3rem)**: Espaçamento entre seções principais.
- **64px (4rem)**: Espaçamento entre seções de página.

## Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Animações

- **Transições**: 150ms cubic-bezier(0.4, 0, 0.2, 1)
- **Hover**: Sutis mudanças de escala, sombra ou cor.
- **Entrada**: Fade in, slide up para elementos que entram na viewport.
- **Flutuação**: Movimento suave para elementos decorativos.

## Acessibilidade

- **Contraste**: Mínimo de 4.5:1 para texto normal, 3:1 para texto grande.
- **Foco**: Indicadores visíveis para navegação por teclado.
- **Alternativas**: Texto alternativo para imagens e ícones.
- **Semântica**: Uso apropriado de elementos HTML.

## Responsividade

- **Mobile First**: Design inicialmente para dispositivos móveis.
- **Flexibilidade**: Layouts que se adaptam a diferentes tamanhos de tela.
- **Simplificação**: Versões simplificadas de componentes complexos em telas menores.
- **Otimização**: Carregamento otimizado de recursos para diferentes dispositivos.
