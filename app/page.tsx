export const dynamic = 'force-dynamic'

import HeroSection from '@/components/shop/HeroSection'
import CollectionsShowcase from '@/components/shop/CollectionsShowcase'
import MarqueeTicker from '@/components/shop/MarqueeTicker'
import AboutStats from '@/components/shop/AboutStats'
import EcoFeature from '@/components/shop/EcoFeature'
import FAQSection from '@/components/shop/FAQSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CollectionsShowcase />
      {/* <MarqueeTicker /> */}
      <AboutStats />
      {/* <EcoFeature /> */}
      <FAQSection />
    </>
  )
}
