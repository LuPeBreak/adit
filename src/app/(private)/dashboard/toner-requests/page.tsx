import { getTonerRequests } from '@/actions/toner-requests/get-toner-requests'
import { tonerRequestsTableColumns } from '@/components/data-tables/toner-requests/toner-requests-table-columns'
import { TonerRequestsTableToolbar } from '@/components/data-tables/toner-requests/toner-requests-table-toolbar'
import { DataTable } from '@/components/data-tables/data-table'
import { ErrorAlert } from '@/components/error-alert'
import DashboardContainer from '@/components/dashboard-container'

export default async function TonerRequestsPage() {
  const response = await getTonerRequests()

  return (
    <DashboardContainer
      title="Pedidos de Toner"
      description="Visualize e gerencie os pedidos de toner cadastrados."
    >
      {response.success ? (
        <DataTable
          columns={tonerRequestsTableColumns}
          data={response.data || []}
          toolbar={<TonerRequestsTableToolbar />}
        />
      ) : (
        <div className="mt-6">
          <ErrorAlert
            title="Erro ao carregar pedidos de toner"
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
