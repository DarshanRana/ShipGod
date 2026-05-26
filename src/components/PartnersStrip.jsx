import { motion } from 'framer-motion';

const partners = [
  { name: 'Tata Projects', abbr: 'TATA', color: '#1976D2' },
  { name: 'L&T Construction', abbr: 'L&T', color: '#e53935' },
  { name: 'BHEL', abbr: 'BHEL', color: '#43a047' },
  { name: 'Adani Logistics', abbr: 'ADANI', color: '#ff8f00' },
  { name: 'Mahindra Logistics', abbr: 'M&M', color: '#d32f2f' },
  { name: 'JSW Steel', abbr: 'JSW', color: '#1565C0' },
  { name: 'SAIL', abbr: 'SAIL', color: '#00838F' },
  { name: 'NTPC Limited', abbr: 'NTPC', color: '#2E7D32' },
  { name: 'Reliance Industries', abbr: 'RIL', color: '#4527A0' },
  { name: 'ACC Cement', abbr: 'ACC', color: '#6D4C41' },
  { name: 'Ultratech Cement', abbr: 'UCL', color: '#F57F17' },
  { name: 'Vedanta Group', abbr: 'VED', color: '#AD1457' },
];

const allPartners = [...partners, ...partners];

export default function PartnersStrip() {
  return (
    <section className="py-14 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-widest text-[#002f56] mb-2"
        >
          Trusted by India's Leading Companies
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #ffffff, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, #ffffff, transparent)' }} />

        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: [0, `-${partners.length * 188}px`] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 32,
            ease: 'linear',
          }}
        >
          {allPartners.map((p, i) => (
            <div
              key={`${p.abbr}-${i}`}
              className="flex items-center gap-3 bg-white rounded-lg px-5 py-3.5 border border-gray-200 shrink-0 hover:border-[#0077c8] hover:shadow-sm transition-all cursor-default"
              style={{ minWidth: '172px' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0"
                style={{ background: `${p.color}15`, border: `1px solid ${p.color}30`, color: p.color }}
              >
                {p.abbr.slice(0, 2)}
              </div>
              <span className="text-[#002f56] text-sm font-semibold whitespace-nowrap">{p.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
