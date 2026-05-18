import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { machineryCategories } from '../data/mockData';
import { HiArrowRight } from 'react-icons/hi';

const pricingMap = {
  'Excavators': '₹18,000',
  'Cranes': '₹24,000',
  'Industrial Machines': '₹15,000',
  'Generators': '₹12,000',
  'Containers': '₹10,000',
  'Construction Equipment': '₹16,000',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function MachineryCategories({ onCategoryClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="categories" className="py-24 px-6 relative">
      {/* Top glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] opacity-15"
          style={{ background: 'radial-gradient(ellipse at center, #f97316 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-orange-300 border border-orange-500/20 mb-5">
            <span>⚙️</span> All Machinery Types Covered
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Transport Any <span className="gradient-text">Heavy Equipment</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From excavators to industrial transformers — our verified carrier network handles every category safely.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 gap-5"
        >
          {machineryCategories.map((cat) => {
            const startingPrice = pricingMap[cat.name] || '₹10,000';
            return (
              <motion.div
                key={cat.id}
                variants={item}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryClick && onCategoryClick(cat)}
                className="group cursor-pointer glass rounded-2xl p-6 border border-white/8 hover:border-opacity-40 transition-all duration-400 relative overflow-hidden"
              >
                {/* Hover gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${cat.color}18 0%, transparent 70%)` }}
                />

                {/* Starting price badge */}
                <div
                  className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                  style={{ background: `${cat.color}18`, color: cat.color, border: `1px solid ${cat.color}30` }}
                >
                  from {startingPrice}
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.12 }}
                  transition={{ duration: 0.4 }}
                  className="text-4xl mb-4 relative z-10"
                >
                  {cat.icon}
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-base font-bold mb-1 transition-colors" style={{ color: cat.color }}>
                    {cat.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{cat.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Avg. Weight</div>
                      <div className="text-sm text-white font-medium">{cat.avgWeight}</div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ background: cat.color + '15', color: cat.color }}
                    >
                      {cat.count}+ carriers
                    </div>
                  </div>

                  {/* Browse CTA — shows on hover */}
                  <div className="flex items-center gap-1 mt-3 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                    style={{ color: cat.color }}>
                    Browse carriers <HiArrowRight className="text-xs" />
                  </div>
                </div>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${cat.color}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
