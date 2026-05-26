import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { HiMenuAlt3, HiX, HiTruck, HiSun, HiMoon, HiLogout } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { label: 'Ship Something', href: '#categories' },
  { label: 'Reviews', href: '#testimonials' },
];

export default function Navbar({ onSearchClick, darkMode, onToggleDark, onAboutClick, onSignInClick, onSignUpClick, onHomeClick, onAdminClick }) {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'shadow-md border-b py-3'
          : 'bg-[#002f56] py-4'
        }`}
      style={scrolled ? {
        backgroundColor: 'var(--nav-scrolled-bg)',
        borderColor: 'var(--nav-scrolled-border)',
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={onHomeClick}
        >
          <div className="w-9 h-9 rounded-lg bg-[#0fa14a] flex items-center justify-center">
            <HiTruck className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold">
            <span className={scrolled ? 'text-[#002f56]' : 'text-white'}>Ship</span>
            <span className="text-[#0fa14a]">God</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${scrolled
                  ? 'text-slate-700 hover:text-[#0077c8]'
                  : 'text-white/90 hover:text-white'
                }`}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onAboutClick}
            className={`text-sm font-semibold uppercase tracking-wide transition-colors duration-200 ${
              scrolled ? 'text-slate-700 hover:text-[#0077c8]' : 'text-white/90 hover:text-white'
            }`}
          >
            About Us
          </button>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${scrolled
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
          >
            <motion.div
              key={darkMode ? 'moon' : 'sun'}
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
            >
              {darkMode ? <HiSun className="text-lg" /> : <HiMoon className="text-lg" />}
            </motion.div>
          </button>
          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              <div
                className={`text-sm font-semibold px-3 py-1.5 rounded-lg ${
                  scrolled ? 'bg-slate-100 text-[#002f56]' : 'bg-white/10 text-white'
                }`}
              >
                👋 {user.name.split(' ')[0]}
              </div>
              {user.isAdmin && (
                <button
                  onClick={onAdminClick}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    scrolled ? 'bg-[#002f56]/10 text-[#002f56] hover:bg-[#002f56]/20' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  🛡️ Dashboard
                </button>
              )}
              <button
                onClick={() => { signOut(); onHomeClick(); }}
                title="Sign Out"
                className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  scrolled ? 'text-red-600 hover:bg-red-50' : 'text-red-300 hover:text-red-200'
                }`}
              >
                <HiLogout className="text-base" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onSignInClick}
                className={`text-sm font-semibold px-4 py-2 rounded transition-colors ${
                  scrolled ? 'text-[#002f56] hover:text-[#0077c8]' : 'text-white hover:text-white/80'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={onSignUpClick}
                className="text-sm font-bold px-4 py-2 rounded-lg border-2 border-[#0fa14a] text-[#0fa14a] hover:bg-[#0fa14a] hover:text-white transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
          <button
            onClick={onSearchClick}
            className="text-sm font-bold px-5 py-2 rounded bg-[#0fa14a] text-white hover:bg-[#0d8a3f] transition-colors"
          >
            Get a Quote
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${scrolled ? 'text-slate-700 bg-slate-100' : 'text-white bg-white/10'
              }`}
          >
            {darkMode ? <HiSun className="text-base" /> : <HiMoon className="text-base" />}
          </button>
          <button
            className={`text-2xl ${scrolled ? 'text-[#002f56]' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t overflow-hidden"
            style={{ backgroundColor: 'var(--nav-scrolled-bg)', borderColor: 'var(--border-color)' }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-semibold uppercase tracking-wide text-sm hover:text-[#0077c8] transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { onAboutClick(); setMenuOpen(false); }}
                className="text-left font-semibold uppercase tracking-wide text-sm hover:text-[#0077c8] transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                About Us
              </button>
              <button
                onClick={onSearchClick}
                className="w-full text-sm font-bold px-5 py-2.5 rounded bg-[#0fa14a] text-white hover:bg-[#0d8a3f] transition-colors"
              >
                Get a Quote
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
