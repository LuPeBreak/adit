import { DataTable } from '@/components/data-tables/data-table'
import { departmentsTableColumns } from '@/components/data-tables/departments/departments-table-columns'
import { GlobalTableToolbar } from '@/components/data-tables/global-table-toolbar'
import { getDepartments } from '@/actions/departments/get-departments'
import { CreateDepartmentButton } from '@/components/data-tables/departments/create-department-button'
import { ErrorAlert } from '@/components/error-alert'

export default async function DepartmentsPage() {
  const response = await getDepartments()

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">Secretarias</h1>

      {response.success ? (
        <DataTable
          columns={departmentsTableColumns}
          data={response.data || []}
          createDialog={<CreateDepartmentButton />}
          toolbar={<GlobalTableToolbar />}
        />
      ) : (
        <div className="mt-6">
          <ErrorAlert
            title="Erro ao carregar departamentos"
            message={
              response.error?.message ||
              'Ocorreu um erro inesperado ao carregar os dados.'
            }
            type="error"
            refreshButtonText="Recarregar página"
          />
        </div>
      )}
    </div>
  )
}
