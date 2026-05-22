import React from 'react'
import InfoLayout from '@/components/InfoLayout';
import DevTicker from '@/components/DevTicker';
import TechStack from '@/components/TechStack';
import EducationLog from '@/components/EducationLog';
import HeroSection from '@/components/HeroSection';
import BubbleScene from '@/components/BubbleScene';

const page = () => {
  return (
    <div>
      <HeroSection />
      {/* <DevTicker /> */}
      <InfoLayout />
      {/* <EducationLog /> */}
      {/* <TechStack /> */}

      <BubbleScene />
    </div>
  )
}

export default page;