import React from 'react'
import DevTicker from '@/components/DevTicker';
import InfoLayout from '@/components/InfoLayout';
import HeroSection from '@/components/HeroSection';
import BubbleScene from '@/components/BubbleScene';
import ScrollCardStackReveal from '@/components/ScrollCardStackReveal';

const page = () => {
  return (
    <div>
      {/* <HeroSection />
      <InfoLayout />
      <DevTicker />
      <BubbleScene /> */}
      <ScrollCardStackReveal />
    </div>
  )
}

export default page;