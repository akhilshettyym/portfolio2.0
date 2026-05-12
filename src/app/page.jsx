import React from 'react'
import InfoLayout from '@/components/InfoLayout';
import DevTicker from '@/components/DevTicker';
import TechStack from '@/components/TechStack';
import EducationLog from '@/components/EducationLog';
import HeroSection from '@/components/HeroSection';

const page = () => {
  return (
    <main className="pt-12 md:pt-12">
      <HeroSection />
      <DevTicker />
      <InfoLayout />
      <EducationLog />
      <TechStack />
    </main>
  )
}

export default page;