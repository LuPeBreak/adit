import { ErrorAlert } from '@/components/error-alert'
import { DataTable } from '@/components/data-tables/data-table'
import { statusHistoryColumns } from '@/components/data-tables/status-history/status-history-columns'
import { StatusHistoryToolbar } from '@/components/data-tables/status-history/status-history-toolbar'
import { getAssetTypeLabel } from '@/lib/utils/get-status-label'
import { getAssetHistoryByTagAction } from '@/actions/assets/get-asset-history-by-tag'
import DashboardContainer from '@/components/dashboard-container'

interface StatusHistoryPageProps {
  params: Promise<{
    tag: string
  }>
}

export default async function StatusHistoryPage({
  params,
}: StatusHistoryPageProps) {
  const { tag } = await params

  const assetHistoryResult = await getAssetHistoryByTagAction({ tag })
  const asset = assetHistoryResult.success
    ? assetHistoryResult.data?.asset
    : null
  const history = assetHistoryResult.success
    ? assetHistoryResult.data?.assetHistory || []
    : []

  return (
    <DashboardContainer 
    title={
      asset
            ? `${asset.tag} - ${getAssetTypeLabel(asset.assetType)}`
            : `Histórico de Status - ${tag}`} description={`Histórico de status do ativo ${tag}`}>
      {!assetHistoryResult.success ? (
        <div className="mt-6">
          <ErrorAlert
            title="Erro ao carregar ativo"
            message={
              assetHistoryResult.error?.message || 'Ativo não encontrado'
            }
            type="error"
            refreshButtonText="Recarregar página"
          />
        </div>
      ) : (
        <DataTable
          columns={statusHistoryColumns}
          data={history}
          toolbar={<StatusHistoryToolbar />}
        />
      )}
    </DashboardContainer>

      
  )
}
