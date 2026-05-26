import React from 'react'
import DevTicker from '@/components/DevTicker';
import InfoLayout from '@/components/InfoLayout';
import HeroSection from '@/components/HeroSection';
import BubbleScene from '@/components/BubbleScene';
import CardStackReveal from '@/components/CardStackReveal';

const page = () => {
  return (
    <div>
      {/* <HeroSection />
      <InfoLayout />
      <DevTicker />
      <BubbleScene /> */}
      <CardStackReveal />
    </div>
  )
}

export default page;