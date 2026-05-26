import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { testimonials } from '../data/mockData';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

function TestimonialCard({ t, isActive, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`relative bg-white rounded-xl p-6 border transition-all duration-300 cursor-pointer shrink-0 w-[300px] md:w-[340px] snap-start ${
        isActive
          ? 'border-[#0077c8] shadow-lg shadow-blue-500/10'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Quote mark */}
      <div className="absolute top-4 right-5 text-5xl text-gray-100 font-serif leading-none select-none">"</div>

      <StarRow rating={t.rating} />

      <p className="text-slate-600 text-sm mt-4 mb-5 leading-relaxed line-clamp-4 relative z-10">
        "{t.text}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.avatarColor}, ${t.avatarColor}80)` }}
        >
          {t.avatar}
        </div>
        <div className="min-w-0">
          <div className="text-[#002f56] font-semibold text-sm truncate">{t.name}</div>
          <div className="text-slate-500 text-xs truncate">{t.role}, {t.company}</div>
        </div>
      </div>

      {isActive && (
        <div className="mt-3 pt-3 border-t border-blue-100 text-xs text-[#0077c8] font-semibold">
          📦 {t.project}
        </div>
      )}
    </motion.div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);

  const scrollBy = (dir) => {
    const next = Math.max(0, Math.min(testimonials.length - 1, active + dir));
    setActive(next);
    const el = scrollRef.current;
    if (el) {
      const cardWidth = el.scrollWidth / testimonials.length;
      el.scrollTo({ left: next * cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <section id="testimonials" className="py-20 px-6 bg-[#f5f6f7]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#0077c8] mb-3">
            ⭐ Customer Reviews
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#002f56] mb-4">
            What Our Clients Say
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Hear from operations managers and procurement heads who trust ShipGod for critical shipments.
          </p>
        </motion.div>

        {/* Rating Summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="text-5xl font-extrabold text-[#002f56]">4.9</div>
          <div>
            <div className="flex items-center gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map(i => <HiStar key={i} className="text-yellow-400 text-lg" />)}
            </div>
            <div className="text-slate-500 text-sm">Based on 3,200+ verified reviews</div>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #f5f6f7, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(-90deg, #f5f6f7, transparent)' }} />

          <motion.div
            ref={scrollRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={t.id}
                t={t}
                isActive={active === i}
                onClick={() => setActive(i)}
              />
            ))}
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => scrollBy(-1)}
            disabled={active === 0}
            className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-slate-500 hover:text-[#0077c8] hover:border-[#0077c8] transition-all disabled:opacity-30"
          >
            <HiChevronLeft className="text-lg" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); scrollBy(i - active); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active === i ? 'bg-[#0077c8] w-8' : 'bg-gray-300 w-1.5 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => scrollBy(1)}
            disabled={active === testimonials.length - 1}
            className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-slate-500 hover:text-[#0077c8] hover:border-[#0077c8] transition-all disabled:opacity-30"
          >
            <HiChevronRight className="text-lg" />
          </button>
        </div>
      </div>
    </section>
  );
}
