import { DashboardSidebar } from '@/components/sidebar/dashboard-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
