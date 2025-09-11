'use client'

import { useState } from 'react'
import {
  MoreHorizontal,
  Pencil,
  Trash,
  History,
  Waypoints,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { PhoneRowActionsProps } from './phones-table-types'
import { UpdateAssetStatusForm } from '../assets/update-asset-status-dialog-form'
import { authClient } from '@/lib/auth/auth-client'
import Link from 'next/link'
import { DeletePhoneConfirmationDialog } from './delete-phone-confirmation-dialog'
import { UpdatePhoneDialogForm } from './update-phone-dialog-form'
import { PhoneDetailsDialog } from './phone-details-dialog'

export function PhoneRowActions({ row }: PhoneRowActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  const { data: session } = authClient.useSession()

  const phone = row.original
  const isAdmin = session?.user.role === 'ADMIN'

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
          <DropdownMenuItem onClick={() => setDetailsDialogOpen(true)}>
            <Eye />
            Ver Detalhes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Pencil />
            Editar
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
              <Trash className="text-destructive" />
              <span className="text-destructive">Deletar</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
            <Waypoints />
            Atualizar Estado
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/assets/status-history/${phone.tag}`}>
              <History />
              Histórico de Estados
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UpdateAssetStatusForm
        assetId={phone.assetId}
        currentStatus={phone.status}
        currentSectorId={phone.sectorId}
        assetTag={phone.tag}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />

      <UpdatePhoneDialogForm
        phone={phone}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {isAdmin && (
        <DeletePhoneConfirmationDialog
          phone={phone}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}

      <PhoneDetailsDialog
        phone={phone}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </>
  )
}
