import { HeroSection } from '@/components/home/hero-section'
import { ServicesSection } from '@/components/home/services-section'
import { AboutSection } from '@/components/home/about-section'
import { FooterSection } from '@/components/home/footer-section'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradiente global que se estende por toda a página */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent opacity-70 z-0 pointer-events-none"></div>

      {/* Efeito de bolhas/círculos decorativos */}
      <div className="absolute -top-20 right-0 w-2/5 h-2/5 bg-primary/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 z-0 pointer-events-none animate-pulse-slow"></div>
      <div className="absolute top-1/3 -left-20 w-1/3 h-1/3 bg-primary/8 rounded-full blur-[80px] z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-1/4 h-1/4 bg-primary/5 rounded-full blur-[120px] translate-y-1/2 z-0 pointer-events-none animate-pulse-slow"></div>

      <div className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <FooterSection />
      </div>
    </main>
  )
}
