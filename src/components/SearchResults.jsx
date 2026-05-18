import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { companies } from '../data/mockData';
import CompanyCard from './CompanyCard';
import CompanyModal from './CompanyModal';
import { HiFilter, HiSortAscending, HiSearch, HiX, HiLocationMarker, HiArrowLeft } from 'react-icons/hi';

const sortOptions = ['Top Rated', 'Most Reviews', 'Highest Capacity', 'Alphabetical'];
const filterOptions = ['All', 'Available Now', 'Verified Only', 'Excavators', 'Cranes', 'Industrial Machines', 'Generators', 'Containers', 'Construction Equipment'];

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10" />
        <div className="flex-1">
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-white/10 rounded w-full mb-2" />
      <div className="h-3 bg-white/10 rounded w-4/5 mb-4" />
      <div className="h-10 bg-white/10 rounded-xl" />
    </div>
  );
}

export default function SearchResults({ searchData, onBack }) {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [sort, setSort] = useState('Top Rated');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const pickup = searchData?.pickup || '';
  const drop = searchData?.drop || '';
  const machinery = searchData?.machinery || '';

  // Filter by city: show companies whose serviceLocations include the pickup city
  const cityFiltered = companies.filter(c => {
    if (!pickup) return true;
    const p = pickup.trim().toLowerCase();
    return c.serviceLocations.some(loc => loc.trim().toLowerCase() === p);
  });

  const filtered = cityFiltered
    .filter(c => {
      if (activeFilter === 'Available Now') return c.availableNow;
      if (activeFilter === 'Verified Only') return c.verified;
      if (activeFilter !== 'All') return c.specialties.some(s => s.toLowerCase().includes(activeFilter.toLowerCase()));
      return true;
    })
    .filter(c =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(c => {
      if (!machinery || machinery === 'Any Equipment') return true;
      const mWords = machinery.toLowerCase().split(/[\s\/]+/).filter(w => w.length > 3);
      return c.specialties.some(s => {
        const sl = s.toLowerCase();
        return mWords.some(w => sl.includes(w) || w.includes(sl));
      });
    })
    .sort((a, b) => {
      if (sort === 'Top Rated') return b.rating - a.rating;
      if (sort === 'Most Reviews') return b.reviewCount - a.reviewCount;
      if (sort === 'Highest Capacity') return b.maxCapacityNum - a.maxCapacityNum;
      if (sort === 'Alphabetical') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <section className="min-h-screen pt-24 pb-20 px-6"
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-orange-400 text-sm mb-5 transition-colors group"
          >
            <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            {pickup ? (
              <>Heavy Transport Agencies in <span className="gradient-text">{pickup}</span></>
            ) : (
              <>All Heavy Transport Agencies</>
            )}
          </h2>
          <p className="text-slate-400 flex items-center gap-2 flex-wrap">
            {pickup && (
              <span className="flex items-center gap-1">
                <HiLocationMarker className="text-orange-400" />
                Pickup: <strong className="text-white">{pickup}</strong>
              </span>
            )}
            {drop && (
              <span className="flex items-center gap-1 text-slate-500">
                → Drop: <strong className="text-slate-300">{drop}</strong>
              </span>
            )}
            {machinery && machinery !== 'Any Equipment' && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/15 text-orange-300 border border-orange-500/20">
                {machinery}
              </span>
            )}
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl flex items-center gap-3 px-4 py-3 mb-5 border border-white/8"
        >
          <HiSearch className="text-orange-400 text-lg shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by company name, address, or specialty…"
            className="bg-transparent flex-1 text-sm text-white placeholder-slate-500 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <HiX className="text-slate-500 hover:text-white" />
            </button>
          )}
        </motion.div>

        {/* Filters & Sort */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="flex gap-2 flex-wrap flex-1">
            {filterOptions.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeFilter === f
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'glass border-white/10 text-slate-300 hover:border-orange-500/30 hover:text-orange-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <HiSortAscending className="text-slate-400" />
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="glass rounded-xl px-3 py-1.5 text-sm text-slate-300 border border-white/10 outline-none focus:border-orange-500/30 bg-transparent"
            >
              {sortOptions.map(s => (
                <option key={s} value={s} className="bg-slate-900">{s}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Count */}
        <div className="text-slate-400 text-sm mb-6">
          Found <span className="text-orange-400 font-semibold">{filtered.length}</span> verified agencies
          {pickup && <span> in or near <strong className="text-white">{pickup}</strong></span>}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-white font-semibold mb-2">No agencies found</h3>
            <p className="text-slate-400 text-sm">
              No transport agencies currently listed for <strong className="text-white">{pickup}</strong>.
              Try a nearby major city or clear filters.
            </p>
            <button onClick={onBack} className="btn-primary mt-6 px-6 py-2.5 text-sm rounded-xl">
              Search Again
            </button>
          </div>
        )}

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((company, i) => (
            <CompanyCard
              key={company.id}
              company={company}
              index={i}
              onViewDetails={setSelectedCompany}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCompany && (
          <CompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
