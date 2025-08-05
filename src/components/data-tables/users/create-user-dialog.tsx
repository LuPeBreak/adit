'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { BasicDialog } from '@/components/basic-dialog'
import { createUserAction } from '@/actions/users/create-user'
import { toast } from 'sonner'
import { createUserSchema, type CreateUserData } from '@/lib/schemas/user'
import { Role } from '@/generated/prisma'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { roles } from '@/lib/utils/role-utils'
import { generateStandardPassword } from '@/lib/utils/password-utils'

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({
  open,
  onOpenChange,
}: CreateUserDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [shouldGeneratePassword, setShouldGeneratePassword] = useState(false)

  const form = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'OPERATOR' as Role,
    },
  })

  function handleNameChange(name: string) {
    form.setValue('name', name)
    if (shouldGeneratePassword && name.trim()) {
      const generatedPassword = generateStandardPassword(name)
      form.setValue('password', generatedPassword)
    }
  }

  function handleGeneratePasswordChange(checked: boolean) {
    setShouldGeneratePassword(checked)
    if (checked) {
      const name = form.getValues('name')
      if (name.trim()) {
        const generatedPassword = generateStandardPassword(name)
        form.setValue('password', generatedPassword)
      }
    } else {
      form.setValue('password', '')
    }
  }

  // Função para copiar senha para clipboard
  async function copyPasswordToClipboard() {
    const password = form.getValues('password')
    if (password) {
      try {
        await navigator.clipboard.writeText(password)
        toast.success('Senha copiada para a área de transferência!')
      } catch (error) {
        console.error('Erro ao copiar senha:', error)
        toast.error('Erro ao copiar senha')
      }
    }
  }

  async function onSubmit(data: CreateUserData) {
    const response = await createUserAction(data)
    if (!response.success) {
      toast.error(response.error?.message || 'Erro ao criar usuário')
      return
    }

    form.reset()
    if (shouldGeneratePassword) {
      toast.success('Usuário criado com sucesso! Senha gerada.')
    } else {
      toast.success('Usuário criado com sucesso!')
    }

    onOpenChange(false)
  }

  const currentPassword = form.watch('password')

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Criar Usuário"
      description="Preencha os dados para criar um novo usuário no sistema."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite o nome completo"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleNameChange(e.target.value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Digite o email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              checked={shouldGeneratePassword}
              onCheckedChange={handleGeneratePasswordChange}
            />
            <div className="space-y-1 leading-none">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Gerar senha automaticamente
              </label>
              <p className="text-xs text-muted-foreground">
                Gera uma senha no formato: nome.sobrenome1234
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite a senha"
                      {...field}
                      readOnly={shouldGeneratePassword}
                      className={shouldGeneratePassword ? 'bg-muted' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                {shouldGeneratePassword && currentPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyPasswordToClipboard}
                    >
                      Copiar Senha
                    </Button>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Usuário'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </BasicDialog>
  )
}
