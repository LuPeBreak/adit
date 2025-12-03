'use client'

import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarLinkProps {
  url: string
  title: string
  icon: React.ReactNode
}

export function SidebarLink({ url, title, icon }: SidebarLinkProps) {
  const { isMobile, setOpenMobile } = useSidebar()
  const pathname = usePathname()
  const isActive = pathname === url

  return (
    <SidebarMenuButton asChild onClick={() => isMobile && setOpenMobile(false)}>
      <Link href={url} aria-current={isActive ? 'page' : undefined}>
        {icon}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  )
}
