'use client'

import { useState } from 'react'
import { Ban, KeyRound, ShieldCheck } from 'lucide-react'
import { RowActionsButton } from '@/components/data-tables/row-actions-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { UserRowActionsProps } from './users-table-types'
import { BanUserDialog } from './ban-user-dialog'
import { UnbanUserDialog } from './unban-user-dialog'
import { authClient } from '@/lib/auth/auth-client'
import type { Role } from '@/generated/prisma'
import { ChangePasswordDialog } from './change-password-dialog'

export function UserRowActions({ row }: UserRowActionsProps) {
  const user = row.original
  const { data: session } = authClient.useSession()
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false)
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false)
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false)

  const isUserBanned = user.banned === true

  // Não mostrar ações se é o próprio usuário
  if (session?.user?.id === user.id) {
    return null
  }

  // Gate de permissões (síncrono via role)
  if (!session?.user?.role) {
    return <RowActionsButton />
  }

  // Permissões separadas para ações de usuário via role/statement
  const canChangePassword = authClient.admin.checkRolePermission({
    permissions: { user: ['set-password'] },
    role: session.user.role as Role,
  })
  const canBan = authClient.admin.checkRolePermission({
    permissions: { user: ['ban'] },
    role: session.user.role as Role,
  })

  return (
    <>
      <ChangePasswordDialog
        user={{
          id: user.id,
          name: user.name,
        }}
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      />
      <BanUserDialog
        user={user}
        open={isBanDialogOpen}
        onOpenChange={setIsBanDialogOpen}
      />
      <UnbanUserDialog
        user={user}
        open={isUnbanDialogOpen}
        onOpenChange={setIsUnbanDialogOpen}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <RowActionsButton />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {canChangePassword && (
            <DropdownMenuItem
              onClick={() => setIsChangePasswordDialogOpen(true)}
            >
              <KeyRound />
              Alterar Senha
            </DropdownMenuItem>
          )}
          {isUserBanned && canBan && (
            <DropdownMenuItem onClick={() => setIsUnbanDialogOpen(true)}>
              <ShieldCheck className="text-green-600" />
              <span className="text-green-600">Desbanir</span>
            </DropdownMenuItem>
          )}
          {!isUserBanned && canBan && (
            <DropdownMenuItem onClick={() => setIsBanDialogOpen(true)}>
              <Ban className="text-destructive" />
              <span className="text-destructive">Banir</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
