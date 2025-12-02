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
  SidebarMenuItem,
} from '../ui/sidebar'
import Link from 'next/link'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { NavUser } from './nav-user'
import { SidebarLink } from './sidebar-link'

const menuLinks = {
  Geral: {
    roles: [
      'ADMIN',
      'OPERATOR_ASSETS',
      'OPERATOR_PHONES',
      'OPERATOR_PRINTERS',
      'OPERATOR_ORG',
    ],
    links: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
        roles: ['ADMIN'],
      },
      {
        title: 'Todos os Ativos',
        url: '/dashboard/assets',
        icon: PackageOpen,
        roles: ['ADMIN', 'OPERATOR_ASSETS'],
      },
      {
        title: 'Pedidos de Manutenção',
        url: '/dashboard/maintenance-requests',
        icon: Wrench,
        roles: [
          'ADMIN',
          'OPERATOR_ASSETS',
          'OPERATOR_PHONES',
          'OPERATOR_PRINTERS',
        ],
      },
    ],
  },
  Impressoras: {
    roles: ['ADMIN', 'OPERATOR_ASSETS', 'OPERATOR_PRINTERS'],
    links: [
      {
        title: 'Impressoras',
        url: '/dashboard/printers',
        icon: Printer,
        roles: ['ADMIN', 'OPERATOR_ASSETS', 'OPERATOR_PRINTERS'],
      },
      {
        title: 'Modelos de Impressoras',
        url: '/dashboard/printer-models',
        icon: Printer,
        roles: ['ADMIN', 'OPERATOR_ASSETS', 'OPERATOR_PRINTERS'],
      },
      {
        title: 'Pedidos de Toner',
        url: '/dashboard/toner-requests',
        icon: FileText,
        roles: ['ADMIN', 'OPERATOR_ASSETS', 'OPERATOR_PRINTERS'],
      },
    ],
  },
  Telefones: {
    roles: ['ADMIN', 'OPERATOR_ASSETS', 'OPERATOR_PHONES'],
    links: [
      {
        title: 'Telefones',
        url: '/dashboard/phones',
        icon: Phone,
        roles: ['ADMIN', 'OPERATOR_ASSETS', 'OPERATOR_PHONES'],
      },
    ],
  },
  'Estrutura Organizacional': {
    roles: ['ADMIN', 'OPERATOR_ORG'],
    links: [
      {
        title: 'Secretarias',
        url: '/dashboard/departments',
        icon: Landmark,
        roles: ['ADMIN', 'OPERATOR_ORG'],
      },
      {
        title: 'Setores',
        url: '/dashboard/sectors',
        icon: Users,
        roles: ['ADMIN', 'OPERATOR_ORG'],
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
                      <SidebarLink
                        url={link.url}
                        title={link.title}
                        icon={<link.icon />}
                      />
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
