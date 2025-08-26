import { getPrinters } from '@/actions/printers/get-printers'
import { DataTable } from '@/components/data-tables/data-table'
import { printersTableColumns } from '@/components/data-tables/printers/printers-table-columns'
import { PrintersTableToolbar } from '@/components/data-tables/printers/printers-table-toolbar'
import { CreatePrinterButton } from '@/components/data-tables/printers/create-printer-button'
import { ErrorAlert } from '@/components/error-alert'
import DashboardContainer from '@/components/dashboard-container'

export default async function PrintersPage() {
  const response = await getPrinters()

  return (
    <DashboardContainer
      title="Impressoras"
      description="Visualize e gerencie as impressoras cadastradas."
    >
      {response.success ? (
        <DataTable
          columns={printersTableColumns}
          data={response.data || []}
          createDialog={<CreatePrinterButton />}
          toolbar={<PrintersTableToolbar />}
        />
      ) : (
        <div className="mt-6">
          <ErrorAlert
            title="Erro ao carregar impressoras"
            message={
              response.error?.message ||
              'Ocorreu um erro inesperado ao carregar os dados.'
            }
            type="error"
            refreshButtonText="Recarregar página"
          />
        </div>
      )}
    </DashboardContainer>
  )
}
