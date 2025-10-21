import { Separator } from '@/components/ui/separator'
import {
  Printer,
  Monitor,
  User,
  Mail,
  Phone,
  Mouse,
  Projector,
  KeyRound,
} from 'lucide-react'
import { ServiceCard, type Service } from './service-card'

const services: Service[] = [
  // Grupo 1: Serviços Ativos
  {
    title: 'Solicitação de Toner',
    description:
      'Solicite toners para impressoras do seu setor de forma rápida e prática',
    icon: Printer,
    href: '/servicos/toner',
  },

  // Grupo 2: Manutenções (todas juntas)
  {
    title: 'Manutenção de Impressora',
    description:
      'Solicite manutenção para impressoras com problemas técnicos ou necessidade de reparo.',
    icon: Printer,
    href: '/servicos/manutencao?assetType=PRINTER',
  },
  {
    title: 'Manutenção de Telefone',
    description:
      'Solicite manutenção para telefones com problemas técnicos ou necessidade de reparo.',
    icon: Phone,
    href: '/servicos/manutencao?assetType=PHONE',
  },
  {
    title: 'Manutenção de Computador',
    description:
      'Solicite manutenção para computadores e equipamentos de informática.',
    icon: Monitor,
    href: '#',
    isComingSoon: true,
  },

  // Grupo 3: Gestão de Usuários e Senhas (temas próximos)
  {
    title: 'Solicitação de Usuário',
    description:
      'Faça solicitações para criação de usuários em sistemas de prefeitura de Barra Mansa.',
    icon: User,
    href: '#',
    isComingSoon: true,
  },
  {
    title: 'Redefinição de Senha',
    description:
      'Solicite a redefinição de senhas para sistemas externos da prefeitura.',
    icon: KeyRound,
    href: '#',
    isComingSoon: true,
  },

  // Grupo 4: Outros Serviços
  {
    title: 'Solicitação de Periféricos',
    description:
      'Solicite mouse, teclado, fones de ouvido e outros periféricos para seu posto de trabalho.',
    icon: Mouse,
    href: '#',
    isComingSoon: true,
  },
  {
    title: 'Agendamento de Projetor',
    description:
      'Agende o empréstimo de projetores para apresentações e reuniões.',
    icon: Projector,
    href: '#',
    isComingSoon: true,
  },
  {
    title: 'Criação de Email',
    description: 'Solicite a criação de novos endereços de email corporativo.',
    icon: Mail,
    href: '#',
    isComingSoon: true,
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos Serviços
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Acesse os serviços disponibilizados pela Coordenadoria de Tecnologia
            da Informação
          </p>
          <Separator className="mt-8 max-w-md mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
