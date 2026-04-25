import { GridBackground } from '@/components/ui/GridBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Problema } from '@/components/sections/Problema'
import { Servicios } from '@/components/sections/Servicios'
import { Proceso } from '@/components/sections/Proceso'
import { PorQueYo } from '@/components/sections/PorQueYo'
import { Testimonios } from '@/components/sections/Testimonios'
import { CTAFinalCTA } from '@/components/sections/CTAFinal'

export default function Home() {
  return (
    <>
      <GridBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero showUrgency />
        <Testimonios />
        <Problema />
        <Servicios />
        <Proceso />
        <PorQueYo />
        <CTAFinalCTA showUrgency />
      </main>
      <Footer />
    </>
  )
}
