'use client'

import { useState } from 'react'
import { MoreHorizontal, History, Waypoints } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export function AssetRowActions({ row }: AssetRowActionsProps) {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)

  const asset = row.original

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
            <Waypoints />
            Atualizar Estado
          </DropdownMenuItem>
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
