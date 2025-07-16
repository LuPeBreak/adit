import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-900 dark:text-gray-100">
      <div className="text-center max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
          Bem-vindo ao{' '}
          <span className="text-blue-600 dark:text-blue-400">ADIT</span>
        </h1>
        <p className="text-xl md:text-2xl font-light leading-relaxed">
          O <strong>ADIT</strong> (Administração de Ativos e TI) é o sistema de
          gestão desenvolvido para otimizar o controle e a manutenção de ativos
          e serviços de TI da Prefeitura de Barra Mansa.
        </p>
        <p className="text-lg md:text-xl leading-relaxed">
          Nosso objetivo é proporcionar visibilidade, organização e um fluxo de
          trabalho otimizado para a equipe de TI, começando pela gestão
          eficiente de impressoras.
        </p>
        <Button asChild variant="default" className="text-foreground">
          <Link href={'/login'}>Fazer Login</Link>
        </Button>
      </div>
    </main>
  )
}
