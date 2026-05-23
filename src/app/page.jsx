import React from 'react'
import InfoLayout from '@/components/InfoLayout';
import HeroSection from '@/components/HeroSection';
import BubbleScene from '@/components/BubbleScene';
import DevTicker from '@/components/DevTicker';

const page = () => {
  return (
    <div>
      <HeroSection />
      <InfoLayout />
      <DevTicker />
      <BubbleScene />
    </div>
  )
}

export default page;