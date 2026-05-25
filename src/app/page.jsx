import React from 'react'
import InfoLayout from '@/components/InfoLayout';
import HeroSection from '@/components/HeroSection';
import BubbleScene from '@/components/BubbleScene';
import DevTicker from '@/components/DevTicker';
import GithubGraphQl from '@/components/GithubGraphQl';

const page = () => {
  return (
    <div>
      {/* <HeroSection />
      <InfoLayout />
      <DevTicker />
      <BubbleScene /> */}
      <GithubGraphQl />
    </div>
  )
}

export default page;