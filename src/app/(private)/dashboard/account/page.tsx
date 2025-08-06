import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AccountForm } from '@/components/account/account-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ChangePasswordForm } from '@/components/account/change-password-form'
export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="font-bold text-2xl">Minha Conta</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações de segurança.
          </p>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais aqui.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccountForm
                user={{
                  id: session.user.id,
                  name: session.user.name,
                  email: session.user.email,
                }}
              />
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Alteração de Senha */}
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Altere sua senha para manter sua conta segura.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
