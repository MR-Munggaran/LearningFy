import { motion } from "framer-motion";
import Particles from "../React-Bits/Particles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden ">
      {/* Particles as background */}
      <div style={{ width: "100%", height: "900px", position: "absolute" }}>
        <Particles
          particleColors={["#2563EB", "#10B981", "#1E293B"]}
          particleCount={180}
          particleSpread={12}
          speed={0.15}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-[30vh] lg:py-[35vh] text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
        >
          Tingkatkan Skill Programming{" "}
          <span className="text-blue-600">Lebih Cepat</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Belajar dari course interaktif, latihan real project, dan mentor
          berpengalaman. Jadikan perjalanan coding-mu lebih seru 🚀
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/login"
            className="rounded-xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
          >
            🎓 Mulai Belajar
          </Link>
          <Link
            to="/course"
            className="rounded-xl border border-gray-300 px-6 py-3 text-lg font-semibold text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all"
          >
            🔍 Lihat Demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
