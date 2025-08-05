'use client'

import { useState } from 'react'
import { Ban, MoreHorizontal, KeyRound, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsChangePasswordDialogOpen(true)}>
            <KeyRound />
            Alterar Senha
          </DropdownMenuItem>
          {isUserBanned ? (
            <DropdownMenuItem onClick={() => setIsUnbanDialogOpen(true)}>
              <ShieldCheck className="text-green-600" />
              <span className="text-green-600">Desbanir</span>
            </DropdownMenuItem>
          ) : (
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
