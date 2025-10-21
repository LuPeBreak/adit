import { CheckCircle } from 'lucide-react'

export function AboutSection() {
  const features = [
    'Solicitação de toners para impressoras',
    'Solicitação de manutenção de equipamentos',
    'Acompanhamento de status das solicitações',
    'Sistema de notificação via WhatsApp e email',
    'Interface moderna e responsiva',
  ]

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Sobre o ADIT
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            O ADIT é uma plataforma desenvolvida para facilitar a solicitação e
            o gerenciamento de serviços de TI na Prefeitura Municipal de Barra
            Mansa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Funcionalidades Disponíveis
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-6 sm:p-8 rounded-lg border border-border">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Objetivo do Sistema
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Proporcionar maior visibilidade, organização e otimização do fluxo
              de trabalho da equipe de TI, centralizando as solicitações de
              serviços e facilitando o acompanhamento de cada demanda.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
