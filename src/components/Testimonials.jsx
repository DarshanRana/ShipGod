import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonials } from '../data/mockData';
import { HiStar, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-slate-600'}`} />
      ))}
    </div>
  );
}

// Individual testimonial card
function TestimonialCard({ t, isActive, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={onClick}
      className={`relative glass rounded-2xl p-6 border transition-all duration-400 cursor-pointer shrink-0 w-[300px] md:w-[340px] snap-start ${
        isActive
          ? 'border-orange-500/40 shadow-xl shadow-orange-500/10'
          : 'border-white/8 hover:border-white/15'
      }`}
    >
      {/* Quote mark */}
      <div className="absolute top-4 right-5 text-5xl text-white/5 font-serif leading-none select-none">"</div>

      <StarRow rating={t.rating} />

      <p className="text-slate-300 text-sm mt-4 mb-5 leading-relaxed line-clamp-4 relative z-10">
        "{t.text}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-white/8">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.avatarColor}, ${t.avatarColor}80)` }}
        >
          {t.avatar}
        </div>
        <div className="min-w-0">
          <div className="text-white font-semibold text-sm truncate">{t.name}</div>
          <div className="text-slate-400 text-xs truncate">{t.role}, {t.company}</div>
        </div>
      </div>

      {isActive && (
        <div className="mt-3 pt-3 border-t border-orange-500/20 text-xs text-orange-300 font-medium">
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
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden">
      {/* BG glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[280px] opacity-8 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(ellipse at center, #f97316, transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-yellow-300 border border-yellow-500/20 mb-5">
            <HiStar className="text-yellow-400" /> Trusted by Industry Leaders
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Hear from operations managers and procurement heads who trust ShipGod for their most critical shipments.
          </p>
        </motion.div>

        {/* Overall rating summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="text-5xl font-extrabold gradient-text">4.9</div>
          <div>
            <div className="flex items-center gap-0.5 mb-1">
              {[1,2,3,4,5].map(i => <HiStar key={i} className="text-yellow-400 text-lg" />)}
            </div>
            <div className="text-slate-400 text-sm">Based on 3,200+ verified reviews</div>
          </div>
        </motion.div>

        {/* Horizontal scroll carousel */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #0a1628, transparent)' }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(-90deg, #0a1628, transparent)' }} />

          <motion.div
            ref={scrollRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4"
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
        <div className="flex items-center justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => scrollBy(-1)}
            disabled={active === 0}
            className="w-10 h-10 glass rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all disabled:opacity-30"
          >
            <HiChevronLeft className="text-lg" />
          </motion.button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); scrollBy(i - active); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active === i ? 'bg-orange-500 w-8' : 'bg-slate-600 w-1.5 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => scrollBy(1)}
            disabled={active === testimonials.length - 1}
            className="w-10 h-10 glass rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-orange-400 hover:border-orange-500/30 transition-all disabled:opacity-30"
          >
            <HiChevronRight className="text-lg" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
