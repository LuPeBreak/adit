import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

export interface Service {
  title: string
  description: string
  icon: React.ElementType
  href: string
}

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { title, description, icon: Icon, href } = service

  return (
    <Link
      href={href}
      className="group flex flex-col p-6 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full"
    >
      <div className="flex items-start gap-4 mb-3">
        <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
          {title}
        </h3>
      </div>
      <p className="text-muted-foreground flex-grow">{description}</p>
      <div className="mt-4 flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Acessar</span>
        <ArrowRight size={16} className="ml-1" />
      </div>
    </Link>
  )
}
