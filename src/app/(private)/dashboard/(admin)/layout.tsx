import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function PrivateAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user.role !== 'ADMIN') return redirect('/dashboard')
  return <>{children}</>
}
