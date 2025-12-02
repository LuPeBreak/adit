'use client'

import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'
import Link from 'next/link'

interface SidebarLinkProps {
  url: string
  title: string
  icon: React.ReactNode
}

export function SidebarLink({ url, title, icon }: SidebarLinkProps) {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarMenuButton asChild onClick={() => isMobile && setOpenMobile(false)}>
      <Link href={url}>
        {icon}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  )
}
