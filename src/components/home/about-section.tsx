import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Printer, Cpu, FileText, Users } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Sobre o ADIT</h2>
            <p className="text-muted-foreground">
              Nosso objetivo é proporcionar visibilidade, organização e um fluxo
              de trabalho otimizado para a equipe de TI, começando pela gestão
              eficiente de impressoras.
            </p>
            <p className="text-muted-foreground">
              O sistema está em constante evolução, com novos recursos sendo
              adicionados regularmente para atender às necessidades da
              administração municipal.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/sobre">Saiba mais</Link>
            </Button>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-card p-6 rounded-lg border border-border">
              <Printer className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">
                Gestão de Impressoras
              </h3>
              <p className="text-sm text-muted-foreground">
                Controle completo do parque de impressoras
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <Cpu className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Ativos de TI</h3>
              <p className="text-sm text-muted-foreground">
                Gerenciamento de todos os ativos tecnológicos
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <FileText className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Documentação</h3>
              <p className="text-sm text-muted-foreground">
                Documentação técnica centralizada
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <Users className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Gestão de Usuários</h3>
              <p className="text-sm text-muted-foreground">
                Controle de acesso e permissões
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
