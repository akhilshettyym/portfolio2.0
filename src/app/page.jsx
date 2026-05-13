import React from 'react'
import InfoLayout from '@/components/InfoLayout';
import DevTicker from '@/components/DevTicker';
import TechStack from '@/components/TechStack';
import EducationLog from '@/components/EducationLog';
import HeroSection from '@/components/HeroSection';

const page = () => {
  return (
    <div>
      <HeroSection />
      <DevTicker />
      <InfoLayout />
      {/* <EducationLog />
      <TechStack /> */}
    </div>
  )
}

export default page;