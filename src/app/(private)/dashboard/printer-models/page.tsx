import { getPrinterModels } from '@/actions/printer-models/get-printer-models'
import { DataTable } from '@/components/data-tables/data-table'
import { printerModelsTableColumns } from '@/components/data-tables/printer-models/printer-models-table-columns'
import { GlobalTableToolbar } from '@/components/data-tables/global-table-toolbar'
import { CreatePrinterModelButton } from '@/components/data-tables/printer-models/create-printer-model-button'
import { ErrorAlert } from '@/components/error-alert'

export default async function PrinterModelsPage() {
  const response = await getPrinterModels()

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">Modelos de Impressora</h1>
      
      {response.success ? (
        <DataTable
          data={response.data || []}
          columns={printerModelsTableColumns}
          createDialog={<CreatePrinterModelButton />}
          toolbar={<GlobalTableToolbar />}
        />
      ) : (
        <div className="mt-6">
          <ErrorAlert 
             title="Erro ao carregar modelos de impressora"
             message={response.error?.message || 'Ocorreu um erro inesperado ao carregar os dados.'}
             type="error"
             refreshButtonText="Recarregar página"
           />
        </div>
      )}
    </div>
  )
}
