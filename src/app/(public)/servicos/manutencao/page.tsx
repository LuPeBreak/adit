import { PublicMaintenanceRequestForm } from '@/components/forms/public-maintenance-request-form'
import { Wrench } from 'lucide-react'

export default function MaintenanceRequestPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Solicitação de Manutenção
          </h1>
          <p className="text-muted-foreground">
            Preencha o formulário abaixo para solicitar manutenção para seu
            equipamento
          </p>
        </div>

        <PublicMaintenanceRequestForm />
      </div>
    </div>
  )
}
