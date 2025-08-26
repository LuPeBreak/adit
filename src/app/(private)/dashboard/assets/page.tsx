import { getAssets } from '@/actions/assets/get-assets'
import DashboardContainer from '@/components/dashboard-container'
import { assetsTableColumns } from '@/components/data-tables/assets/assets-table-columns'
import { AssetsTableToolbar } from '@/components/data-tables/assets/assets-table-toolbar'
import { DataTable } from '@/components/data-tables/data-table'
import { ErrorAlert } from '@/components/error-alert'

export default async function AssetsPage() {
  const response = await getAssets()

  return (
    <DashboardContainer
      title="Ativos"
      description="Visualize e gerencie os ativos cadastrados."
    >
      {response.success ? (
        <DataTable
          columns={assetsTableColumns}
          data={response.data || []}
          toolbar={<AssetsTableToolbar />}
        />
      ) : (
        <div className="mt-6">
          <ErrorAlert
            title="Erro ao carregar ativos"
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
