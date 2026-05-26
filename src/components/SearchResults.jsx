import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { companies } from '../data/mockData';
import CompanyCard from './CompanyCard';
import CompanyModal from './CompanyModal';
import { HiSortAscending, HiSearch, HiX, HiLocationMarker, HiArrowLeft } from 'react-icons/hi';

const sortOptions = ['Top Rated', 'Most Reviews', 'Highest Capacity', 'Alphabetical'];
const filterOptions = ['All', 'Available Now', 'Verified Only', 'Excavators', 'Cranes', 'Industrial Machines', 'Generators', 'Containers', 'Construction Equipment'];

export default function SearchResults({ searchData, onBack }) {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [sort, setSort] = useState('Top Rated');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const pickup = searchData?.pickup || '';
  const drop = searchData?.drop || '';
  const machinery = searchData?.machinery || '';

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
    <section className="min-h-screen bg-[#f5f6f7]">
      {/* Page Header */}
      <div className="bg-[#002f56] pt-24 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-200/70 hover:text-white text-sm mb-5 transition-colors group"
          >
            <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            {pickup ? (
              <>Heavy Transport Agencies in <span className="text-[#0fa14a]">{pickup}</span></>
            ) : (
              <>All Heavy Transport Agencies</>
            )}
          </h1>
          <p className="text-blue-200/70 flex items-center gap-3 flex-wrap text-sm">
            {pickup && (
              <span className="flex items-center gap-1">
                <HiLocationMarker className="text-[#0fa14a]" />
                Pickup: <strong className="text-white">{pickup}</strong>
              </span>
            )}
            {drop && (
              <span className="flex items-center gap-1">
                → Drop: <strong className="text-blue-100">{drop}</strong>
              </span>
            )}
            {machinery && machinery !== 'Any Equipment' && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-[#0fa14a]/20 text-[#4ade80] border border-[#0fa14a]/30 font-semibold">
                {machinery}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search bar */}
        <div className="bg-white rounded-xl flex items-center gap-3 px-4 py-3 mb-5 border border-gray-200 shadow-sm">
          <HiSearch className="text-[#0077c8] text-lg shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by company name, address, or specialty…"
            className="bg-transparent flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none font-medium"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <HiX className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap flex-1">
            {filterOptions.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${
                  activeFilter === f
                    ? 'bg-[#002f56] border-[#002f56] text-white'
                    : 'bg-white border-gray-200 text-slate-600 hover:border-[#0077c8] hover:text-[#0077c8]'
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
              className="bg-white rounded-lg px-3 py-1.5 text-sm text-slate-700 border border-gray-200 shadow-sm outline-none focus:border-[#0077c8] font-medium"
            >
              {sortOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Count */}
        <div className="text-slate-500 text-sm mb-6 font-medium">
          Found <span className="text-[#002f56] font-bold">{filtered.length}</span> verified agencies
          {pickup && <span> in or near <strong className="text-[#002f56]">{pickup}</strong></span>}
        </div>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-[#002f56] font-bold text-lg mb-2">No agencies found</h3>
            <p className="text-slate-500 text-sm">
              No transport agencies currently listed for <strong className="text-[#002f56]">{pickup}</strong>.
              Try a nearby major city or clear filters.
            </p>
            <button onClick={onBack} className="btn-primary mt-6 px-6 py-2.5 text-sm rounded-lg">
              Search Again
            </button>
          </div>
        )}

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
