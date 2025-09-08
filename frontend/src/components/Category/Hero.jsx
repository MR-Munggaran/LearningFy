import React from 'react'

const Hero = () => {
  return (
    <div className="">
              <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 items-center gap-10">
          {/* Left Content */}
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Tingkatkan Skill <br />
              <span className="text-blue-600">Programming</span> Anda <br />
              dengan Kursus Berkualitas
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Pilih dari berbagai kategori bahasa pemrograman dan tingkatkan kemampuan coding Anda dengan bimbingan instructor profesional.
            </p>
          </div>
          {/* Right Content */}
          <div className="relative order-1 md:order-2">
            {/* Background Shapes */}
            <div className="absolute w-40 h-40 bg-yellow-200 rounded-lg top-10 -left-10 opacity-70" />
            <div className="absolute w-20 h-20 bg-blue-300 rounded-full top-20 left-32 opacity-70" />
            <div className="absolute w-12 h-12 border border-gray-300 rounded-full bottom-10 left-16 opacity-70" />
            <div className="absolute w-10 h-10 bg-blue-200 rounded-full bottom-20 right-16 opacity-70" />
            {/* Image */}
            <img
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
              alt="Programming Illustration"
              className="relative z-10 mx-auto rounded-lg shadow-xl"
              style={{ maxHeight: "300px" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero