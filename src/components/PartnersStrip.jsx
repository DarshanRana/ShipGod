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

// Duplicate for seamless loop
const allPartners = [...partners, ...partners];

export default function PartnersStrip() {
  return (
    <section className="py-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060e1f 0%, #080f1f 100%)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(30,79,160,0.5), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(30,79,160,0.5), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-slate-400 border border-white/8 mb-3"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Trusted by Industry Leaders
        </motion.div>
      </div>

      {/* Left / Right fade masks */}
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #080f1f, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, #080f1f, transparent)' }} />

        {/* Marquee track */}
        <motion.div
          className="flex gap-5 w-max"
          animate={{ x: [0, `-${partners.length * 188}px`] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          }}
        >
          {allPartners.map((p, i) => (
            <div
              key={`${p.abbr}-${i}`}
              className="flex items-center gap-3 glass rounded-2xl px-5 py-3 border border-white/8 shrink-0 hover:border-white/20 transition-all cursor-default"
              style={{ minWidth: '170px' }}
            >
              {/* Logo placeholder */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shrink-0"
                style={{ background: `${p.color}30`, border: `1px solid ${p.color}40` }}
              >
                {p.abbr.slice(0, 2)}
              </div>
              <span className="text-slate-300 text-sm font-semibold whitespace-nowrap">{p.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
