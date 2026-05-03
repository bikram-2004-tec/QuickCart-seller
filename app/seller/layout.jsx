'use client'

import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navbar */}
      <Navbar />

      <div className="flex">

        {/* Sidebar */}
        <div className="w-60 max-sm:w-16 bg-white border-r min-h-screen">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  )
}

export default Layout