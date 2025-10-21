import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="py-12 md:py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            ADIT
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Sistema de Gestão de Ativos e Serviços de TI
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Plataforma integrada para solicitação de serviços de TI da
            Prefeitura Municipal de Barra Mansa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="#servicos">Ver Serviços</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
