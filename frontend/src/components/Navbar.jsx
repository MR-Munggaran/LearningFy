import React, { useState } from 'react';
import { FiMenu, FiX } from "react-icons/fi";
import { NavLink } from 'react-router-dom';
import Logo from "../assets/Mung.png";
import GooeyNav from './React-Bits/GooeyNav';
import ElectricBorder from './React-Bits/ElectricBorder';
import { useAuthContext } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout"; // pastikan hook ini ada

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { authUser } = useAuthContext();
  const { logout, loading } = useLogout();

  // Navigation dasar
  let navigation = [
    { label: 'Home', href: '/' },
    { label: 'Course', href: '/course' },
    { label: 'Category', href: '/category' },
    { label: 'Contact Us', href: '/contact-us' },
  ];

  // Kalau login, baru tampilkan dashboard
  if (authUser) {
    navigation.push({ label: 'Dashboard', href: '/dashboard' });
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-black">
      {/* Main navbar */}
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <NavLink to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Cinemax</span>
            <img
              alt="Cinemax"
              src={Logo}
              className="h-[5vh] w-auto transition-transform hover:scale-110"
            />
          </NavLink>
        </div>

        {/* Mobile toggle */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <FiMenu aria-hidden="true" className="size-6" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-12">
          <div className="text-sm font-semibold">
            <GooeyNav
              items={navigation}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
        </div>

        {/* Auth button desktop */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {authUser ? (
            <ElectricBorder
              color="#ffffff"
              speed={1}
              chaos={0.5}
              thickness={3}
              style={{ borderRadius: 12 }}
            >
              <div>
                <button
                  onClick={logout}
                  style={{ padding: '0.5rem', opacity: 1 }}
                  className="text-white"
                  disabled={loading}
                >
                  {loading ? "Logging out..." : `Logout →`}
                </button>
              </div>
            </ElectricBorder>
          ) : (
            <ElectricBorder
              color="#ffffff"
              speed={1}
              chaos={0.5}
              thickness={3}
              style={{ borderRadius: 12 }}
            >
              <div>
                <NavLink style={{ padding: '1rem', opacity: 1 }} to="/login">
                  Log in →
                </NavLink>
              </div>
            </ElectricBorder>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar menu */}
          <div className="ml-auto h-full w-64 bg-white dark:bg-gray-900 shadow-lg p-6 
                          transform transition-transform duration-300 z-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold dark:text-white">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <FiX className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                {/* Navigation links */}
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-blue-100/25"
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                {/* Auth button mobile */}
                <div className="py-6">
                  {authUser ? (
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-red-600 hover:bg-red-100"
                      disabled={loading}
                    >
                      {loading ? "Logging out..." : "Logout"}
                    </button>
                  ) : (
                    <NavLink
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-blue-100"
                    >
                      Log in
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
