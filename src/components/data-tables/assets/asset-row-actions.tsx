'use client'

import { useState } from 'react'
import { History, Waypoints } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AssetRowActionsProps } from './assets-table-types'
import { UpdateAssetStatusForm } from './update-asset-status-dialog-form'
import Link from 'next/link'
import { authClient } from '@/lib/auth/auth-client'
import type { Role } from '@/generated/prisma'
import { RowActionsButton } from '@/components/data-tables/row-actions-button'

export function AssetRowActions({ row }: AssetRowActionsProps) {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

  const asset = row.original

  // Permissions (síncrono via role)
  const { data: session } = authClient.useSession()
  const role = session?.user?.role as Role | undefined
  if (!role) return <RowActionsButton />

  const canUpdateAsset = authClient.admin.checkRolePermission({
    permissions: { asset: ['update'] },
    role,
  })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <RowActionsButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canUpdateAsset && (
            <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
              <Waypoints />
              Atualizar Estado
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/assets/status-history/${asset.tag}`}>
              <History />
              Histórico de Estados
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateAssetStatusForm
        assetId={asset.id}
        currentStatus={asset.status}
        currentSectorId={asset.sectorId}
        assetTag={asset.tag}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </>
  )
}
