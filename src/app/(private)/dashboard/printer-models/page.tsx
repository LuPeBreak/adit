import { getPrinterModels } from '@/actions/printer-models/get-printer-models'
import { DataTable } from '@/components/data-tables/data-table'
import { printerModelsTableColumns } from '@/components/data-tables/printer-models/printer-models-table-columns'
import { GlobalTableToolbar } from '@/components/data-tables/global-table-toolbar'
import { CreatePrinterModelButton } from '@/components/data-tables/printer-models/create-printer-model-button'

export default async function PrinterModelsPage() {
  const printerModels = await getPrinterModels()
  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">Modelos de Impressora</h1>
      <DataTable
        data={printerModels}
        columns={printerModelsTableColumns}
        toolbar={<GlobalTableToolbar />}
        createDialog={<CreatePrinterModelButton />}
      />
    </div>
  )
}
