import { ErrorAlert } from '@/components/error-alert'
import { DataTable } from '@/components/data-tables/data-table'
import { statusHistoryColumns } from '@/components/data-tables/status-history/status-history-columns'
import { StatusHistoryToolbar } from '@/components/data-tables/status-history/status-history-toolbar'
import { getAssetTypeLabel } from '@/lib/utils/get-status-label'
import { getAssetHistoryByTagAction } from '@/actions/assets/get-asset-history-by-tag'

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
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">
        {asset
          ? `${asset.tag} - ${getAssetTypeLabel(asset.assetType)}`
          : `Histórico de Status - ${tag}`}
      </h1>

      <p className="text-muted-foreground mb-6">
        Histórico de mudanças de status do ativo
      </p>

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
    </div>
  )
}
