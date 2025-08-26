import { UsersTableToolbar } from '@/components/data-tables/users/users-table-toolbar'
import { DataTable } from '@/components/data-tables/data-table'
import { getUsers } from '@/actions/users/get-users'
import { usersTableColumns } from '@/components/data-tables/users/users-table-columns'
import { CreateUserButton } from '@/components/data-tables/users/create-user-button'
import { ErrorAlert } from '@/components/error-alert'
import DashboardContainer from '@/components/dashboard-container'

export default async function UsersPage() {
  const response = await getUsers()

  return (
    <DashboardContainer
      title="Usuários"
      description="Visualize e gerencie os usuários cadastrados."
    >

      {response.success ? (
        <DataTable
          columns={usersTableColumns}
          data={response.data || []}
          createDialog={<CreateUserButton />}
          toolbar={<UsersTableToolbar />}
        />
      ) : (
        <div className="mt-6">
          <ErrorAlert
            title="Erro ao carregar usuários"
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
