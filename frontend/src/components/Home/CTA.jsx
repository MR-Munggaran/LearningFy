import React from "react";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="bg-[#F1F5F9] py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-[#2563EB] leading-snug">
            Belajar Skill Baru. Raih Karier Impianmu.
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Akses ratusan e-course berkualitas dari instruktur berpengalaman.
            Mulai dari <span className="text-[#10B981] font-semibold">programming</span>, 
            desain, hingga bisnis digital — semua bisa kamu pelajari kapan pun, di mana pun.
          </p>
          <p className="mt-4 text-base text-gray-600">
            Tingkatkan keterampilanmu, dapatkan sertifikat, dan jadilah lebih
            percaya diri menghadapi dunia kerja.
          </p>
        </motion.div>

        {/* Right Content (Images Grid) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="col-span-2">
            <img
              src="https://images.unsplash.com/photo-1518933165971-611dbc9c412d?q=80&w=1332&auto=format&fit=crop"
              alt="Belajar online bersama mentor"
              className="rounded-2xl shadow-lg"
            />
          </div>
          <img
            src="https://images.unsplash.com/photo-1587727383733-f5222d6855b5?q=80&w=1170&auto=format&fit=crop"
            alt="Diskusi interaktif"
            className="rounded-2xl shadow-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1698919585695-546e4a31fc8f?q=80&w=1331&auto=format&fit=crop"
            alt="Sesi kolaborasi"
            className="rounded-2xl shadow-lg"
          />
          <div className="col-span-2">
            <img
              src="https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?q=80&w=1332&auto=format&fit=crop"
              alt="Belajar berkelompok"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
