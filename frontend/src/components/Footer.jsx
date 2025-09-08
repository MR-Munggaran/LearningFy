import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";

const FOOTER_LINK = [
  {
    title: "Courses",
    links: ["Home", "course", "category", "contact"],
  },
  {
    title: "Resources",
    links: ["Help Center", "FAQ", "Terms of Service", "Privacy Policy"],
  },
];

const FOOTER_CONTACT_INFO = {
  title: "Contact Us",
  links: [
    { label: "Email", value: "support@elearnify.com" },
    { label: "Phone", value: "+62 812 3456 7890" },
  ],
};

const SOCIAL = [
  { icon: <FaFacebookF />, url: "/" },
  { icon: <FaInstagram />, url: "/" },
  { icon: <FaTwitter />, url: "/" },
  { icon: <FaYoutube />, url: "/" },
  { icon: <FaLinkedin />, url: "/" },
];

const Footer = () => {
  return (
    <footer className="relative bg-[#2563EB] text-white">
      {/* Wave shape */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-[300vh] h-[60px]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V46.29c47.7,22,103.65,29,158,17.39C230.5,50.13,284,17,339.16,5.3,411.22-10,483.65,3.46,554,24.21c66.06,19.42,130.91,48.13,197,61.44,73.91,15,147.57,3,220-17.79V0Z"
            opacity=".25"
            className="fill-white"
          />
          <path
            d="M0,0V15.81C47.42,36,103.36,49,158,43.48,230.5,36.58,284,4,339.16,1.22,411.22-3.53,483.65,11,554,29.19c66.06,17.16,130.91,42.56,197,55.14,73.91,14.3,147.57,5.75,220-11.58V0Z"
            opacity=".5"
            className="fill-white"
          />
          <path
            d="M0,0V5.63C47.42,27.15,103.36,46,158,43.48,230.5,39.78,284,9,339.16,6.14,411.22,1.67,483.65,18,554,33.73c66.06,14.45,130.91,35.83,197,47.59,73.91,13.42,147.57,8.46,220-7.13V0Z"
            className="fill-white"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10 flex flex-col gap-14 relative z-10">
        {/* Logo + Links */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            🎓 E-Learnify
          </Link>

          <div className="flex flex-wrap gap-[5rem]">
            {FOOTER_LINK.map((col) => (
              <FooterColumn title={col.title} key={col.title}>
                <ul className="flex flex-col gap-3 text-sm text-[#F1F5F9]">
                  {col.links.map((link) => (
                    <Link
                      to="/"
                      key={link}
                      className="hover:text-[#10B981] transition-colors"
                    >
                      {link}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            {/* Contact Info */}
            <FooterColumn title={FOOTER_CONTACT_INFO.title}>
              {FOOTER_CONTACT_INFO.links.map((link) => (
                <div
                  key={link.label}
                  className="flex flex-col lg:flex-row lg:items-center gap-2 text-sm text-[#F1F5F9]"
                >
                  <span className="font-medium">{link.label}:</span>
                  <span>{link.value}</span>
                </div>
              ))}
            </FooterColumn>

            {/* Newsletter */}
            <FooterColumn title="Stay Updated">
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="rounded-lg px-3 py-2 text-gray-700 bg-[#F1F5F9] focus:outline-none"
                />
                <button className="bg-[#10B981] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#059669] transition">
                  Subscribe
                </button>
              </form>
            </FooterColumn>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 text-2xl">
          {SOCIAL.map((item, idx) => (
            <a
              to={item.url}
              key={idx}
              className="hover:scale-110 transition-transform hover:text-[#10B981]"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#F1F5F9] opacity-20"></div>

        {/* Copyright */}
        <p className="text-center text-sm text-[#F1F5F9]">
          © 2025 E-Learnify | Empowering Lifelong Learning
        </p>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-4">
      {title && (
        <h4 className="text-lg font-semibold text-white whitespace-nowrap">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
};

export default Footer;
