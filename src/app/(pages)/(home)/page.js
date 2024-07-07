import AboutArea from '@/component/main/pages/home/about-area'
import Slider from '@/component/main/pages/home/banner'
import FeatureLists from '@/component/main/pages/home/feature-lists'
import Lead_Form from '@/component/main/pages/home/lead-form'
import OurBlog from '@/component/main/pages/home/our-blog'
import ServiceAre from '@/component/main/pages/home/service-are'
import WorkingProcess from '@/component/main/pages/home/working-process'
import React from 'react'

const Home = () => {
  return (
   <>
   <Slider/>
   <FeatureLists/>
   <AboutArea/>
   <ServiceAre/>
   <WorkingProcess/>
   <OurBlog/>
   <Lead_Form/>
   </>
  )
}

export default Home