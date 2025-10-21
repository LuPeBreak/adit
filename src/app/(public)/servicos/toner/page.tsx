import { Printer } from 'lucide-react'
import { PublicTonerRequestForm } from '@/components/forms/public-toner-request-form'
import { ContactSection } from '@/components/home/contact-section'

export default function TonerRequestPage() {
  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
              <Printer className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Solicitação de Toner
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Preencha o formulário abaixo para solicitar toner para sua
            impressora
          </p>
        </div>

        <PublicTonerRequestForm />
      </div>

      <ContactSection />
    </div>
  )
}
