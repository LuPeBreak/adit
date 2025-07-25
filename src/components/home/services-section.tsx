import { Separator } from '@/components/ui/separator'
import { Printer, Wrench, Users, Network, Boxes, Globe } from 'lucide-react'
import { ServiceCard, type Service } from './service-card'

const services: Service[] = [
  {
    title: 'Pedido de Toner',
    description: 'Solicite toners para impressoras do seu setor',
    icon: Printer,
    href: '/servicos/toner',
  },
  {
    title: 'Manutenção de Impressoras',
    description: 'Acompanhe o status de manutenção das impressoras',
    icon: Wrench,
    href: '/servicos/manutencao',
  },
  {
    title: 'Criação de Usuários',
    description: 'Solicite criação de usuários para sistemas da prefeitura',
    icon: Users,
    href: '/servicos/usuarios',
  },
  {
    title: 'Acesso à Rede',
    description: 'Solicite acesso à rede para novos equipamentos',
    icon: Network,
    href: '/servicos/rede',
  },
  {
    title: 'Acesso ao COPLAN',
    description: 'Solicite acesso ao sistema de contabilidade',
    icon: Boxes,
    href: '/servicos/coplan',
  },
  {
    title: 'Portal da Transparência',
    description: 'Acesse o portal da transparência da prefeitura',
    icon: Globe,
    href: '/servicos/transparencia',
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="py-20 px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
