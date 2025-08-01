import {
  Landmark,
  Network,
  PackageOpen,
  Printer,
  User,
  Users,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import Link from 'next/link'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { NavUser } from './nav-user'

const menuLinks = {
  Ativos: [
    {
      title: 'Todos os Ativos',
      url: '/dashboard/assets',
      icon: PackageOpen,
      roles: ['OPERATOR', 'ADMIN'],
    },
    {
      title: 'Impressoras',
      url: '/dashboard/printers',
      icon: Printer,
      roles: ['OPERATOR', 'ADMIN'],
    },
    {
      title: 'Modelos de Impressoras',
      url: '/dashboard/printer-models',
      icon: Printer,
      roles: ['OPERATOR', 'ADMIN'],
    },
  ],
  Admin: [
    {
      title: 'Usuários',
      url: '/dashboard/users',
      icon: User,
      roles: ['ADMIN'],
    },
    {
      title: 'Secretarias',
      url: '/dashboard/departments',
      icon: Landmark,
      roles: ['ADMIN'],
    },
    {
      title: 'Setores',
      url: '/dashboard/sectors',
      icon: Users,
      roles: ['ADMIN'],
    },
  ],
}

export async function DashboardSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={'/dashboard'} className="flex gap-2">
          <Network />
          ADIT
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(menuLinks).map(([group, links]) => {
          if (session.user.role !== 'ADMIN' && group === 'Admin') return null
          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel>{group}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map((link) => {
                    if (link.roles.includes(session.user.role as string)) {
                      return (
                        <SidebarMenuItem key={link.title}>
                          <SidebarMenuButton asChild>
                            <Link href={link.url}>
                              <link.icon />
                              <span>{link.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    }
                    return null
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image || undefined,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
