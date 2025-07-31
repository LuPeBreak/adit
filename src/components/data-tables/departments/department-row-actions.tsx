'use client'

import { useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

import { DepartmentDialogForm } from './department-dialog-form'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { DepartmentRowActionsProps } from './departments-table-types'
import { DeleteConfirmationDepartmentDialog } from './delete-confirmation-department-dialog'

export function DepartmentRowActions({ row }: DepartmentRowActionsProps) {
  const department = row.original
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      <DepartmentDialogForm
        initialData={department}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <DeleteConfirmationDepartmentDialog
        id={department.id}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
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
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            Editar Secretaria
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setIsDeleteDialogOpen(true)}
            className="text-destructive"
          >
            Deletar Secretaria
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
