import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-[20vh] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full font-medium">
              What's new
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Belajar Skill Baru, <br /> 
            <span className="text-blue-600">Kapanpun & Dimanapun</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Tingkatkan kemampuanmu dengan kursus terbaik dari para mentor
            berpengalaman. Mulai gratis sekarang dan upgrade kapan saja.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to={'/login'} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow">
              Mulai Belajar Gratis
            </Link >
            <a href="#courseall" className="flex items-center gap-2 text-blue-600 font-medium">
              Lihat Semua Course <FaArrowRight />
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex gap-4 mb-4">
              <span className="px-3 py-1 rounded-md bg-white/10">CourseCard.jsx</span>
              <span className="px-3 py-1 rounded-md bg-white/10">App.jsx</span>
            </div>
            <pre className="text-sm font-mono leading-relaxed">
            {`function CourseCard() {
            return (
                <div className="p-4 border rounded-lg shadow">
                <h3 className="font-bold">Belajar React</h3>
                <p className="text-gray-500">Gratis</p>
                <button className="bg-blue-600 text-white px-3 py-1 mt-2 rounded">
                    Enroll
                </button>
                </div>
            )
            }`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
