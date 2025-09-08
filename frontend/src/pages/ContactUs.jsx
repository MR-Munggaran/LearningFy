import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaMapMarked } from "react-icons/fa";

export default function ContactUs() {
  return (
    <section className="bg-[#F1F5F9] py-[9rem]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#2563EB] sm:text-5xl">
            Connect With Us
          </h2>
          <p className="mt-4 text-lg text-gray-700 sm:text-xl max-w-2xl mx-auto">
            Got questions or ideas? Reach out to our team—we’re excited to hear from you! 
            Fill out the form or use our contact info below.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Contact Form */}
          <form className="bg-white p-8 rounded-2xl shadow-lg space-y-6 hover:shadow-2xl transition">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="John Doe"
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm 
                focus:border-[#2563EB] focus:ring-[#2563EB] sm:text-sm px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="john@example.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm 
                focus:border-[#2563EB] focus:ring-[#2563EB] sm:text-sm px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-900">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Write your message here..."
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm 
                focus:border-[#2563EB] focus:ring-[#2563EB] sm:text-sm px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#10B981] 
              px-6 py-3 text-white font-semibold hover:from-[#1E50C3] hover:to-[#0E9E73] 
              shadow-lg transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info + Map */}
          <div className="space-y-8">
            <div className="space-y-5">
              {/* Address */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow hover:shadow-md transition">
                <FaMapMarked className="h-6 w-6 text-[#2563EB] flex-shrink-0 animate-pulse" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Our Office</h3>
                  <p className="mt-1 text-gray-700 text-sm">
                    123 Main Street, Jakarta, Indonesia
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow hover:shadow-md transition">
                <FaPhoneAlt className="h-6 w-6 text-[#2563EB] flex-shrink-0 animate-pulse" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-700 text-sm">+62 812-3456-7890</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow hover:shadow-md transition">
                <MdEmail className="h-6 w-6 text-[#2563EB] flex-shrink-0 animate-pulse" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-700 text-sm">support@elearnify.com</p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="h-64 w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37692.294323070826!2d105.23835465117307!3d-6.780272381371692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e4384b6a3d20d41%3A0x50cbabd14186b4f3!2sMercusuar%20Ujungjaya%2CTaman%20Nasional%20Ujung%20Kulon!5e0!3m2!1sen!2sid!4v1755845460771!5m2!1sen!2sid"
                width="100%"
                height="100%"
                className="border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
