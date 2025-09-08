import React from 'react'
import Hero from '../components/Home/Hero'
import Categories from '../components/Home/Categories'
import PopularCourses from '../components/Home/PopularCourses'
import Testimonials from '../components/Home/Testimonials'
import Pricing from '../components/Home/Pricing'
import LogoLoop from '../components/Home/LogoLoop'
import CTA from '../components/Home/CTA'

const Home = () => {
  return (
    <>
      <Hero/>
      <LogoLoop/>
      <Categories/>
      <PopularCourses/>
      <Testimonials/>
      {/* <Pricing/> */}
      <CTA/>
    </>
  )
}

export default Home