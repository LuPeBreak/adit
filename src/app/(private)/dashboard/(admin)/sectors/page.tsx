import { getSectors } from '@/actions/sectors/get-sectors'
import { DataTable } from '@/components/data-tables/data-table'
import { GlobalTableToolbar } from '@/components/data-tables/global-table-toolbar'
import { sectorsTableColumns } from '@/components/data-tables/sectors/sectors-table-columns'
import { CreateSectorButton } from '@/components/data-tables/sectors/create-sector-button'

export default async function SectorsPage() {
  const sectors = await getSectors()

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">Setores</h1>
      <DataTable
        columns={sectorsTableColumns}
        data={sectors}
        toolbar={<GlobalTableToolbar />}
        createDialog={<CreateSectorButton />}
      />
    </div>
  )
}
