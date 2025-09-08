import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Platform ini benar-benar membantu saya meningkatkan skill programming. Kursusnya jelas, instruktur sangat berpengalaman, dan progress tracking-nya memotivasi banget.",
      name: "Andi Pratama",
      role: "Frontend Developer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      quote:
        "Saya suka karena materinya praktis dan langsung bisa dipakai di pekerjaan sehari-hari. UI/UX kursusnya juga enak, mudah dipahami, dan modern.",
      name: "Siti Aisyah",
      role: "UI/UX Designer",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      quote:
        "Belajar di sini bikin saya lebih percaya diri apply kerja sebagai backend dev. Project-projectnya realistis banget dan jadi portfolio juga.",
      name: "Rizky Saputra",
      role: "Backend Engineer",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-blue-50 to-white px-6 py-24 sm:py-32 lg:px-8">
      {/* Background effect */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_60rem_at_top,var(--color-indigo-100),white)] opacity-30" />

      <div className="mx-auto max-w-7xl text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Apa Kata Mereka?
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Dipercaya oleh ribuan programmer untuk mengembangkan skill coding
          mereka 🚀
        </p>

        {/* Testimonials */}
        <div className="mt-16 grid gap-12 lg:grid-cols-3">
          {testimonials.map((item, idx) => (
            <motion.figure
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >
              <blockquote className="text-lg font-medium text-gray-800 sm:text-xl">
                <p>“{item.quote}”</p>
              </blockquote>
              <figcaption className="mt-6">
                <img
                  alt={item.name}
                  src={item.image}
                  className="mx-auto size-16 rounded-full ring-2 ring-indigo-500 shadow-sm"
                />
                <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <svg
                    width={3}
                    height={3}
                    viewBox="0 0 2 2"
                    aria-hidden="true"
                    className="fill-gray-500"
                  >
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <div className="text-indigo-600 font-medium">{item.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
