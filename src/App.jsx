import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBand from './components/StatsBand';
import TrustBar from './components/TrustBar';

import MachineryCategories from './components/MachineryCategories';
import PartnersStrip from './components/PartnersStrip';

import Testimonials from './components/Testimonials';

import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

// Lazy load heavy components to drastically reduce initial JS payload
const SearchResults = lazy(() => import('./components/SearchResults'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const SignIn = lazy(() => import('./components/SignIn'));
const SignUp = lazy(() => import('./components/SignUp'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const BulkOrderModal = lazy(() => import('./components/BulkOrderModal'));

// High-fidelity dynamic animated loader spinner for premium page-loading UX
function PageLoader() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-t-[#0077c8] border-r-transparent border-b-[#0fa14a] border-l-transparent"
        />
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#002f56] to-[#0077c8]/40"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        className="text-[#002f56] dark:text-blue-100 text-xs font-bold uppercase tracking-widest"
      >
        Loading ShipGod...
      </motion.p>
    </div>
  );
}


const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function App() {
  const { user } = useAuth();
  const [page, setPage] = useState('home'); // 'home' | 'results' | 'about' | 'signin' | 'signup' | 'admin' | 'forgot-password'
  const [searchData, setSearchData] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSearch = (data) => {
    setSearchData(data);
    setPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setPage('home');
    setSearchData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSearch = () => {
    if (page !== 'home') {
      setPage('home');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

      const goToAbout = () => {
    setPage('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToSignIn = () => {
    setPage('signin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToSignUp = () => {
    setPage('signup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToAdmin = () => {
    setPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToForgotPassword = () => {
    setPage('forgot-password');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <Navbar
        onSearchClick={scrollToSearch}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        onAboutClick={goToAbout}
        onSignInClick={goToSignIn}
        onSignUpClick={goToSignUp}
        onHomeClick={goHome}
        onAdminClick={goToAdmin}
      />

      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          {page === 'home' ? (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* 1. Hero */}
              <Hero onSearchSubmit={handleSearch} onBulkOrder={() => setShowBulkModal(true)} />

              {/* Bulk Order Modal - wrapped in nested Suspense so it doesn't trigger the main PageLoader */}
              {showBulkModal && (
                <Suspense fallback={null}>
                  <BulkOrderModal onClose={() => setShowBulkModal(false)} />
                </Suspense>
              )}

              {/* 2. Stats Band — animated counters strip */}
              <StatsBand />

              {/* 3. Trust Bar — Google / AppStore / Verified */}
              <TrustBar />


              {/* 5. Machinery Categories — with pricing hints */}
              <MachineryCategories onCategoryClick={(cat) => handleSearch({ machinery: cat.name })} />

              {/* 6. Partners Marquee Strip */}
              <PartnersStrip />



              {/* 8. Testimonials — horizontal carousel */}
              <Testimonials />

              {/* 9. Footer */}
              <Footer />
            </motion.div>
          ) : page === 'signin' ? (
            <motion.div key="signin" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <SignIn onSuccess={goHome} onGoSignUp={goToSignUp} onGoForgotPassword={goToForgotPassword} />
            </motion.div>
          ) : page === 'forgot-password' ? (
            <motion.div key="forgot-password" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ForgotPassword onGoSignIn={goToSignIn} />
            </motion.div>
          ) : page === 'signup' ? (
            <motion.div key="signup" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <SignUp onSuccess={goHome} onGoSignIn={goToSignIn} />
            </motion.div>
          ) : page === 'admin' ? (
            <motion.div key="admin" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AdminDashboard onBack={goHome} />
            </motion.div>
          ) : page === 'about' ? (
            <motion.div
              key="about"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <AboutUs onGetQuote={scrollToSearch} />
              <Footer />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SearchResults searchData={searchData} onBack={handleBack} />
              <Footer />
            </motion.div>
          )}
        </Suspense>
      </AnimatePresence>
    </div>
  );
}
