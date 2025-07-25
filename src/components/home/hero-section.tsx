import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 px-6">
      <div className="container relative z-10 mx-auto max-w-5xl text-center space-y-8">
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          Sistema de Gestão de Ativos da TI
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          Bem-vindo ao <span className="text-primary">ADIT</span>
        </h1>

        <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl mx-auto text-muted-foreground">
          O <strong className="text-foreground">ADIT</strong> é o sistema de
          gestão desenvolvido para otimizar o controle e a manutenção de ativos
          e serviços de TI da Prefeitura de Barra Mansa.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 text-white font-medium bg-primary hover:bg-primary/90 shadow-md border-2 border-primary/20"
          >
            <Link href="/login">Fazer Login</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8"
          >
            <Link href="#servicos">Nossos Serviços</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
