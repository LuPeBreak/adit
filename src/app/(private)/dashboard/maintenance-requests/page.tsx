import { getMaintenanceRequests } from '@/actions/maintenance-requests/get-maintenance-requests'
import { DataTable } from '@/components/data-tables/data-table'
import { ErrorAlert } from '@/components/error-alert'
import DashboardContainer from '@/components/dashboard-container'
import { maintenanceRequestsTableColumns } from '@/components/data-tables/maintenance-requests/maintenance-requests-table-columns'
import { MaintenanceRequestsTableToolbar } from '@/components/data-tables/maintenance-requests/maintenance-requests-table-toolbar'

export default async function MaintenanceRequestsPage() {
  const response = await getMaintenanceRequests()

  return (
    <DashboardContainer
      title="Solicitações de Manutenção"
      description="Visualize e gerencie as solicitações de manutenção cadastradas."
    >
      {response.success ? (
        <DataTable
          columns={maintenanceRequestsTableColumns}
          data={response.data || []}
          toolbar={<MaintenanceRequestsTableToolbar />}
        />
      ) : (
        <div className="mt-6">
          <ErrorAlert
            title="Erro ao carregar solicitações de manutenção"
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
