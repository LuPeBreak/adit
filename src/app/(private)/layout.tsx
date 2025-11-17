import { DashboardSidebar } from '@/components/sidebar/dashboard-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/auth'

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect('/login')
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="min-h-screen flex flex-col flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
