import { getPhones } from '@/actions/phones/get-phones'
import { DataTable } from '@/components/data-tables/data-table'
import { phonesTableColumns } from '@/components/data-tables/phones/phones-table-columns'
import { PhonesTableToolbar } from '@/components/data-tables/phones/phones-table-toolbar'
import { CreatePhoneButton } from '@/components/data-tables/phones/create-phone-button'
import { ErrorAlert } from '@/components/error-alert'
import DashboardContainer from '@/components/dashboard-container'

export default async function PhonesPage() {
  const response = await getPhones()

  return (
    <DashboardContainer
      title="Telefones"
      description="Visualize e gerencie os telefones cadastrados."
    >
      {response.success ? (
        <DataTable
          columns={phonesTableColumns}
          data={response.data || []}
          createDialog={<CreatePhoneButton />}
          toolbar={<PhonesTableToolbar />}
        />
      ) : (
        <div className="mt-6">
          <ErrorAlert
            title="Erro ao carregar telefones"
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
