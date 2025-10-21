'use client'

import { Mail, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { maskWhatsappNumber } from '@/lib/utils/contact-formatter'

export function ContactSection() {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
  const adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP

  // Não exibir a seção se as variáveis de ambiente não estiverem configuradas
  if (!adminEmail || !adminWhatsApp) {
    return null
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Olá! Preciso de suporte técnico.')
    window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, '_blank')
  }

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(adminEmail)
      toast.success('Email copiado para a área de transferência!')
    } catch {
      toast.error('Erro ao copiar email')
    }
  }

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Contato e Suporte
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Precisa de ajuda? Entre em contato com a Coordenadoria de Tecnologia
            da Informação
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-card p-6 sm:p-8 rounded-lg border border-border">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="bg-primary/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold">WhatsApp</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Atendimento rápido via WhatsApp
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                  {maskWhatsappNumber(adminWhatsApp)}
                </p>
              </div>
            </div>
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Falar no WhatsApp
            </Button>
          </div>

          <div className="bg-card p-6 sm:p-8 rounded-lg border border-border">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="bg-primary/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold">Email</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Envie sua solicitação por email
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                  {adminEmail}
                </p>
              </div>
            </div>
            <Button
              onClick={handleEmailClick}
              variant="outline"
              className="w-full text-sm sm:text-base"
            >
              <Mail className="mr-2 h-4 w-4" />
              Copiar Email
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
