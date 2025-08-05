import { AssetStatus } from '@/generated/prisma'

export function getColoredStatus(status: AssetStatus) {
  switch (status) {
    case AssetStatus.RESERVED:
      return <p className="bg-gray-800 w-fit px-2 rounded-md">Reservado</p>
    case AssetStatus.STOCK:
      return <p className="bg-blue-800 w-fit px-2 rounded-md">Em Estoque</p>
    case AssetStatus.USING:
      return <p className="bg-green-800 w-fit px-2 rounded-md">Em Uso</p>
    case AssetStatus.MAINTENANCE:
      return (
        <p className="bg-yellow-800 w-fit px-2 rounded-md">Em Manutenção</p>
      )
    case AssetStatus.BROKEN:
      return <p className="bg-red-800 w-fit px-2 rounded-md">Quebrado</p>
    default:
      return ''
  }
}
