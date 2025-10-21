import { PublicMaintenanceRequestForm } from '@/components/forms/public-maintenance-request-form'
import { Wrench } from 'lucide-react'
import { ContactSection } from '@/components/home/contact-section'

export default function MaintenanceRequestPage() {
  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
              <Wrench className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Solicitação de Manutenção
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground px-2">
            Preencha o formulário abaixo para solicitar manutenção para seu
            equipamento
          </p>
        </div>

        <PublicMaintenanceRequestForm />
      </div>

      <ContactSection />
    </div>
  )
}
