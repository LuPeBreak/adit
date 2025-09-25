import { DataTable } from '@/components/data-tables/data-table'
import { ErrorAlert } from '@/components/error-alert'
import DashboardContainer from '@/components/dashboard-container'
import { getMaintenanceRequestsUpdates } from '@/actions/maintenance-requests/get-maintenance-request-updates'
import { maintenanceRequestUpdatesTableColumns } from '@/components/data-tables/maintenance-request-updates/maintenance-request-updates-columns'
import { GlobalTableToolbar } from '@/components/data-tables/global-table-toolbar'
import { getAssetTypeLabel } from '@/lib/utils/get-status-label'
import { AssetType } from '@/generated/prisma'

interface MaintenanceRequestUpdatesPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function MaintenanceRequestUpdatesPage({
  params,
}: MaintenanceRequestUpdatesPageProps) {
  const { id } = await params

  const response = await getMaintenanceRequestsUpdates({ id })

  const { maintenanceRequest, maintenanceRequestUpdates } = response.data || {}

  return (
    <DashboardContainer
      title={`Atualizações Pedido de Manutenção - ${maintenanceRequest?.requesterName || ''} - ${maintenanceRequest?.asset?.tag || ''}`}
      description={`${getAssetTypeLabel((maintenanceRequest?.asset?.assetType || '') as AssetType)} - ${maintenanceRequest?.description || ''}`}
    >
      {response.success ? (
        <DataTable
          columns={maintenanceRequestUpdatesTableColumns}
          data={maintenanceRequestUpdates || []}
          toolbar={<GlobalTableToolbar />}
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
