import { getAssets } from '@/actions/get-assets'
import { assetsTableColumns } from '@/components/data-tables/assets/assets-table-columns'
import { AssetsTableToolbar } from '@/components/data-tables/assets/assets-table-toolbar'
import { DataTable } from '@/components/data-tables/data-table'

export default async function AssetsPage() {
  const assets = await getAssets()

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">Lista de Ativos</h1>
      <DataTable
        columns={assetsTableColumns}
        data={assets}
        toolbar={<AssetsTableToolbar />}
      />
    </div>
  )
}
