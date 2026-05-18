import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBand from './components/StatsBand';
import TrustBar from './components/TrustBar';

import MachineryCategories from './components/MachineryCategories';
import PartnersStrip from './components/PartnersStrip';

import Testimonials from './components/Testimonials';

import Footer from './components/Footer';
import SearchResults from './components/SearchResults';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'results'
  const [searchData, setSearchData] = useState(null);

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

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      <Navbar onSearchClick={scrollToSearch} />

      <AnimatePresence mode="wait">
        {page === 'home' ? (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* 1. Hero — two-column with inline search */}
            <Hero onSearchSubmit={handleSearch} />

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
      </AnimatePresence>
    </div>
  );
}
