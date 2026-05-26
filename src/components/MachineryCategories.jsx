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
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function MachineryCategories({ onCategoryClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="categories" className="py-20 px-6 bg-[#f5f6f7]">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#0077c8] mb-3">
            ⚙️ All Machinery Types Covered
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#002f56] mb-4">
            Ship Any Heavy Equipment
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base">
            From excavators to industrial transformers — our verified carrier network handles every category safely.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {machineryCategories.map((cat) => {
            const startingPrice = pricingMap[cat.name] || '₹10,000';
            return (
              <motion.div
                key={cat.id}
                variants={item}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCategoryClick && onCategoryClick(cat)}
                className="group cursor-pointer bg-white rounded-xl p-6 border border-gray-200 hover:border-[#0077c8] hover:shadow-md transition-all duration-200"
              >
                {/* Icon */}
                <div className="text-4xl mb-4">{cat.icon}</div>

                {/* Content */}
                <div>
                  <h3 className="text-base font-bold text-[#002f56] mb-1 group-hover:text-[#0077c8] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{cat.description}</p>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Avg. Weight</div>
                      <div className="text-sm text-[#002f56] font-semibold">{cat.avgWeight}</div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                      style={{ background: cat.color + '18', color: cat.color }}
                    >
                      {cat.count}+ carriers
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#0077c8] opacity-0 group-hover:opacity-100 transition-all duration-200">
                    From {startingPrice} · Browse carriers <HiArrowRight className="text-xs" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
