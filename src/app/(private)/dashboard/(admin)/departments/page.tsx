import { DataTable } from '@/components/data-tables/data-table'
import { departmentsTableColumns } from '@/components/data-tables/departments/departments-table-columns'
import { GlobalTableToolbar } from '@/components/data-tables/global-table-toolbar'
import { getDepartments } from '@/actions/get-departments'

export default async function DepartmentsPage() {
  const departments = await getDepartments()

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">Secretarias</h1>
      <DataTable
        columns={departmentsTableColumns}
        data={departments}
        toolbar={<GlobalTableToolbar />}
      />
    </div>
  )
}
