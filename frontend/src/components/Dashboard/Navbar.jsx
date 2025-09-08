import React, { useState } from 'react';
import { FaBars, FaHome, FaTimes } from "react-icons/fa";
import Logo from "../../assets/Mung.png";
import { FaBook, FaFolder, FaUserGraduate, FaUsers, FaVideo } from "react-icons/fa6";
import { GoFileSubmodule } from "react-icons/go";
import { NavLink } from 'react-router-dom';
import { useAuthContext } from "../../context/AuthContext";
import { useLogout } from "../../hooks/useLogout";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { authUser } = useAuthContext();
  const { logout } = useLogout();

  // Menu berdasarkan role
  const roleNavigation = {
    student: [
      { name: "Dashboard", href: "/dashboard", icon: <FaUserGraduate /> },
      { name: "Home", href: "/", icon: <FaHome /> },
      { name: "My Courses", href: "/dashboard/student/courses", icon: <FaBook /> },
      { name: "Progress Tracking", href: "/dashboard/student/progress", icon: <GoFileSubmodule />},
    ],
    instructor: [
      { name: "Dashboard", href: "/dashboard", icon: <FaUserGraduate /> },
      { name: "Manage Courses", href: "/dashboard/instructor/courses", icon: <FaBook /> },
    ],
    admin: [
      { name: "Dashboard", href: "/dashboard", icon: <FaUserGraduate /> },
      { name: "Home", href: "/", icon: <FaHome /> },
      { name: "User Management", href: "/dashboard/admin/users", icon: <FaUsers /> },
      { name: "Category Management", href: "/dashboard/admin/categories", icon: <FaFolder /> },
      { name: "Tags Management", href: "/dashboard/admin/tags", icon: <FaFolder /> },
    ],
  };

  const navigation = authUser ? roleNavigation[authUser.user.role] || [] : [];

  const userNavigation = [
    { name: "Your profile", href: "/dashboard/profilMe" },
    { name: "Sign out", onClick: logout },
  ];

  return (
    <nav className="bg-[#2563EB] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side (Logo + Links) */}
          <div className="flex items-center">
            <div className="shrink-0">
              <NavLink to={'/dashboard'}>
                <img alt="Your Company" src={Logo} className="h-[5rem] w-[9rem]" />
              </NavLink>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#10B981] text-white shadow-md"
                          : "text-[#F1F5F9] hover:bg-[#10B981]/80 hover:text-white"
                      )
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Profile Dropdown */}
            {authUser && (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center rounded-full focus:outline-none"
                >
                  <img
                    className="h-8 w-8 rounded-full border-2 border-white"
                    src={authUser.imageUrl || "https://placehold.co/400"}
                    alt={authUser.username}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg border border-[#F1F5F9]">
                    {userNavigation.map((item) =>
                      item.onClick ? (
                        <button
                          key={item.name}
                          onClick={item.onClick}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-[#F1F5F9]"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <NavLink
                          key={item.name}
                          to={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#F1F5F9]"
                        >
                          {item.name}
                        </NavLink>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-[#10B981]/80"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2563EB] px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                classNames(
                  "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                  isActive
                    ? "bg-[#10B981] text-white"
                    : "text-[#F1F5F9] hover:bg-[#10B981]/80 hover:text-white"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}

          {/* Mobile User Info */}
          {authUser && (
            <div className="border-t border-[#F1F5F9]/30 pt-4">
              <div className="flex items-center px-5">
                <img
                  className="h-10 w-10 rounded-full border-2 border-white"
                  src={authUser.imageUrl || "https://placehold.co/400"}
                  alt={authUser.username}
                />
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {authUser.username}
                  </div>
                  <div className="text-sm font-medium text-[#F1F5F9]">
                    {authUser.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) =>
                  item.onClick ? (
                    <button
                      key={item.name}
                      onClick={() => {
                        item.onClick();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left block rounded-md px-3 py-2 text-base font-medium text-[#F1F5F9] hover:bg-[#10B981]/80 hover:text-white"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-md px-3 py-2 text-base font-medium text-[#F1F5F9] hover:bg-[#10B981]/80 hover:text-white"
                    >
                      {item.name}
                    </NavLink>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
