import { getSectors } from '@/actions/sectors/get-sectors'
import { DataTable } from '@/components/data-tables/data-table'
import { GlobalTableToolbar } from '@/components/data-tables/global-table-toolbar'
import { sectorsTableColumns } from '@/components/data-tables/sectors/sectors-table-columns'
import { CreateSectorButton } from '@/components/data-tables/sectors/create-sector-button'
import { ErrorAlert } from '@/components/error-alert'
import DashboardContainer from '@/components/dashboard-container'

export default async function SectorsPage() {
  const response = await getSectors()

  return (
    <DashboardContainer
      title="Setores"
      description="Visualize e gerencie os setores cadastrados."
    >
      {response.success ? (
        <DataTable
          columns={sectorsTableColumns}
          data={response.data || []}
          createDialog={<CreateSectorButton />}
          toolbar={<GlobalTableToolbar />}
        />
      ) : (
        <div className="mt-6">
          <ErrorAlert
            title="Erro ao carregar setores"
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
