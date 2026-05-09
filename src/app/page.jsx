import HeroSection from '@/components/HeroSection';
import InfoLayout from '@/components/InfoLayout';
import React from 'react'

const page = () => {
  return (
    <div className='relative w-full overflow-x-hidden'>
      <div className='relative h-screen w-full'>
        <HeroSection />
      </div>

      <div className='relative w-full mt-[-100vh] pt-[100vh]'>
        <InfoLayout />
      </div>
    </div>
  )
}

export default page;
