import React from 'react'
import Navbar from './Navbar'

const Header = () => {
  return (
    <div className="min-h-full">
      <Navbar/>
      <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
      </header>
    </div>
  )
}

export default Header