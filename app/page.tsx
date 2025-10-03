'use client'

import { motion } from 'framer-motion'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { DashboardSection } from '@/components/sections/dashboard-section'
import { MapSection } from '@/components/sections/map-section'
import { ThreeDSection } from '@/components/sections/3d-section'
import { AnalysisSection } from '@/components/sections/analysis-section'
import { StatsSection } from '@/components/sections/stats-section'
import { CtaSection } from '@/components/sections/cta-section'

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Dashboard Section */}
      <DashboardSection />
      
      {/* Map Section */}
      <MapSection />
      
      {/* 3D Section */}
      <ThreeDSection />
      
      {/* Analysis Section */}
      <AnalysisSection />
      
      {/* CTA Section */}
      <CtaSection />
    </div>
  )
}


