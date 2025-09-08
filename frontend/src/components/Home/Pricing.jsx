import { FaCheckSquare } from "react-icons/fa";

const tiers = [
  {
    name: 'Beginner',
    id: 'tier-beginner',
    href: '#',
    priceMonthly: '$19',
    description: 'Cocok untuk kamu yang baru memulai perjalanan belajar coding.',
    features: [
      'Akses 10 video dasar',
      'Materi PDF & modul ringkas',
      'Forum diskusi komunitas',
      'Sertifikat penyelesaian',
    ],
    featured: false,
  },
  {
    name: 'Intermediate',
    id: 'tier-intermediate',
    href: '#',
    priceMonthly: '$49',
    description: 'Level up skill dengan materi lanjutan & proyek nyata.',
    features: [
      'Semua fitur Beginner',
      '50+ video lanjutan',
      'Proyek mini & studi kasus',
      'Akses mentor via chat',
      'Kuis & evaluasi',
    ],
    featured: true,
  },
  {
    name: 'Advanced',
    id: 'tier-advanced',
    href: '#',
    priceMonthly: '$99',
    description: 'Kuasai skill expert dengan bimbingan intensif & portofolio.',
    features: [
      'Semua fitur Intermediate',
      '100+ video premium',
      'Proyek akhir & portofolio',
      '1-on-1 sesi mentoring',
      'Akses event eksklusif',
    ],
    featured: false,
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Pricing() {
  return (
    <div className="relative isolate bg-[#F1F5F9] px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-sm font-semibold text-[#2563EB] uppercase tracking-wide">
          Pricing Plans
        </h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Pilih paket belajar sesuai kebutuhanmu
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Dari pemula hingga expert 🚀 semua bisa mulai belajar coding dengan harga terjangkau.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-5xl lg:grid-cols-3 lg:gap-x-8">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'bg-[#2563EB] text-white shadow-xl' : 'bg-white',
              'rounded-3xl p-8 ring-1 ring-gray-200 sm:p-10 transition hover:scale-105 duration-300'
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? 'text-[#10B981]' : 'text-[#2563EB]',
                'text-base font-semibold'
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-bold tracking-tight',
                )}
              >
                {tier.priceMonthly}
              </span>
              <span className={classNames(tier.featured ? 'text-gray-200' : 'text-gray-500', 'text-base')}>
                /bulan
              </span>
            </p>
            <p className={classNames(tier.featured ? 'text-gray-100' : 'text-gray-600', 'mt-6 text-base')}>
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-100' : 'text-gray-600',
                'mt-8 space-y-3 text-sm sm:mt-10',
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <FaCheckSquare
                    aria-hidden="true"
                    className={classNames(
                      tier.featured ? 'text-[#10B981]' : 'text-[#2563EB]',
                      'h-5 w-5 flex-none'
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-[#10B981] text-white hover:bg-[#0EA271]'
                  : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]',
                'mt-8 block rounded-md px-4 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] sm:mt-10',
              )}
            >
              Mulai Belajar Sekarang
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
