import HeroSection from '@/components/HeroSection';
import InfoLayout from '@/components/InfoLayout';
import React from 'react'

const page = () => {
  return (
    <main className="pt-12 md:pt-12">
      <HeroSection />
      <InfoLayout />
    </main>
  )
}

export default page;