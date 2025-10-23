import {
  Landmark,
  Network,
  PackageOpen,
  Printer,
  Phone,
  User,
  Users,
  FileText,
  LayoutDashboard,
  Wrench,
  Eye,
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
  Geral: {
    roles: ['OPERATOR', 'ADMIN'],
    links: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
        roles: ['OPERATOR', 'ADMIN'],
      },
      {
        title: 'Todos os Ativos',
        url: '/dashboard/assets',
        icon: PackageOpen,
        roles: ['OPERATOR', 'ADMIN'],
      },
      {
        title: 'Pedidos de Manutenção',
        url: '/dashboard/maintenance-requests',
        icon: Wrench,
        roles: ['OPERATOR', 'ADMIN'],
      },
    ],
  },
  Impressoras: {
    roles: ['OPERATOR', 'ADMIN'],
    links: [
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
      {
        title: 'Pedidos de Toner',
        url: '/dashboard/toner-requests',
        icon: FileText,
        roles: ['OPERATOR', 'ADMIN'],
      },
    ],
  },
  Telefones: {
    roles: ['OPERATOR', 'ADMIN'],
    links: [
      {
        title: 'Telefones',
        url: '/dashboard/phones',
        icon: Phone,
        roles: ['OPERATOR', 'ADMIN'],
      },
    ],
  },
  'Estrutura Organizacional': {
    roles: ['ADMIN'],
    links: [
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
  },
  Administração: {
    roles: ['ADMIN'],
    links: [
      {
        title: 'Usuários',
        url: '/dashboard/users',
        icon: User,
        roles: ['ADMIN'],
      },
      {
        title: 'Preview de Notificações',
        url: '/dashboard/notification-previews',
        icon: FileText,
        roles: ['ADMIN'],
      },
    ],
  },
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
        {Object.entries(menuLinks).map(([groupName, group]) => {
          // Verifica se o usuário tem permissão para ver o grupo
          if (!group.roles.includes(session.user.role as string)) return null

          // Filtra os links que o usuário pode ver
          const visibleLinks = group.links.filter((link) =>
            link.roles.includes(session.user.role as string),
          )

          // Se não há links visíveis, não renderiza o grupo
          if (visibleLinks.length === 0) return null

          return (
            <SidebarGroup key={groupName}>
              <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleLinks.map((link) => (
                    <SidebarMenuItem key={link.title}>
                      <SidebarMenuButton asChild>
                        <Link href={link.url}>
                          <link.icon />
                          <span>{link.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
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
