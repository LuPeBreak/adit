import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import React from 'react'

export interface Service {
  title: string
  description: string
  icon: React.ElementType
  href: string
  isComingSoon?: boolean
}

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { title, description, icon: Icon, href, isComingSoon } = service

  const CardContent = (
    <>
      <div className="flex items-start gap-3 sm:gap-4 mb-3">
        <div className={`p-2 rounded-md shrink-0 ${
          isComingSoon 
            ? 'bg-muted text-muted-foreground' 
            : 'bg-primary/10 text-primary'
        }`}>
          <Icon size={20} className="sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg sm:text-xl font-semibold leading-tight ${
            isComingSoon 
              ? 'text-muted-foreground' 
              : 'group-hover:text-primary transition-colors'
          }`}>
            {title}
          </h3>
          {isComingSoon && (
            <span className="inline-block mt-1 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
              Em desenvolvimento
            </span>
          )}
        </div>
      </div>
      <p className={`text-sm sm:text-base flex-grow leading-relaxed ${
        isComingSoon ? 'text-muted-foreground/70' : 'text-muted-foreground'
      }`}>
        {description}
      </p>
      {!isComingSoon && (
        <div className="mt-4 flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Acessar</span>
          <ArrowRight size={16} className="ml-1" />
        </div>
      )}
    </>
  )

  if (isComingSoon) {
    return (
      <div className="flex flex-col p-4 sm:p-6 bg-card rounded-lg border border-border opacity-75 cursor-not-allowed h-full">
        {CardContent}
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="group flex flex-col p-4 sm:p-6 bg-card rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full"
    >
      {CardContent}
    </Link>
  )
}
