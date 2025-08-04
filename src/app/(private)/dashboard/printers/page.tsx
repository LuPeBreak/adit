import { getPrinters } from '@/actions/printers/get-printers'
import { DataTable } from '@/components/data-tables/data-table'
import { printersTableColumns } from '@/components/data-tables/printers/printers-table-columns'
import { PrintersTableToolbar } from '@/components/data-tables/printers/printers-table-toolbar'
import { CreatePrinterButton } from '@/components/data-tables/printers/create-printer-button'

export default async function PrintersPage() {
  const printers = await getPrinters()

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">Impressoras</h1>
      <DataTable
        columns={printersTableColumns}
        data={printers}
        toolbar={<PrintersTableToolbar />}
        createDialog={<CreatePrinterButton />}
      />
    </div>
  )
}
