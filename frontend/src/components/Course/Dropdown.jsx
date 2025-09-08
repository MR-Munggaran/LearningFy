import { useState, useRef, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

export default function Dropwdown({judul, option1, option2, option3,}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Tutup menu kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 
                   text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50"
      >
        {judul}
        <IoMdArrowDropdown
          aria-hidden="true"
          className={`-mr-1 size-5 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white 
                     shadow-lg ring-1 ring-black/5"
        >
          <div className="py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {option1}
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {option2}
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {option3}
            </a>
            {/* <form method="POST" action="#">
              <button
                type="submit"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 
                           hover:bg-gray-100 hover:text-gray-900"
              >
                Sign out
              </button>
            </form> */}
          </div>
        </div>
      )}
    </div>
  );
}
