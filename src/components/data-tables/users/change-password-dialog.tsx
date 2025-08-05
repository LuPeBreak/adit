'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { BasicDialog } from '@/components/basic-dialog'
import { updateUserPasswordAction } from '@/actions/users/update-user-password'
import { generateStandardPassword } from '@/lib/utils/password-utils'
import { toast } from 'sonner'

const changePasswordSchema = z.object({
  password: z
    .string({ message: 'A senha é obrigatória' })
    .min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

type ChangePasswordData = z.infer<typeof changePasswordSchema>

interface ChangePasswordDialogProps {
  user: {
    id: string
    name: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({
  user,
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [shouldGeneratePassword, setShouldGeneratePassword] = useState(false)

  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: '',
    },
  })

  const currentPassword = form.watch('password')

  const handleGeneratePasswordChange = (checked: boolean) => {
    setShouldGeneratePassword(checked)
    if (checked) {
      const generatedPassword = generateStandardPassword(user.name)
      form.setValue('password', generatedPassword)
    } else {
      form.setValue('password', '')
    }
  }

  const copyPasswordToClipboard = async () => {
    if (currentPassword) {
      try {
        await navigator.clipboard.writeText(currentPassword)
        toast.success('Senha copiada para a área de transferência!')
      } catch (error) {
        console.error('Erro ao copiar senha:', error)
        toast.error('Erro ao copiar senha')
      }
    }
  }

  const onSubmit = async (data: ChangePasswordData) => {
    try {
      const result = await updateUserPasswordAction({
        id: user.id,
        password: data.password,
      })

      if (result.success) {
        toast.success('Senha alterada com sucesso!')
        onOpenChange(false)
        form.reset()
        setShouldGeneratePassword(false)
      } else {
        toast.error(result.error?.message || 'Erro ao alterar senha')
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      toast.error('Erro interno ao alterar senha')
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={(newOpen) => {
        onOpenChange(newOpen)
        if (!newOpen) {
          form.reset()
          setShouldGeneratePassword(false)
        }
      }}
      title="Alterar Senha"
      description={`Alterar a senha do usuário ${user.name}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormLabel>Nova Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Digite a nova senha"
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
                  Alterando...
                </>
              ) : (
                'Alterar Senha'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </BasicDialog>
  )
}
