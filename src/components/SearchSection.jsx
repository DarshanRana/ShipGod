import { motion } from 'framer-motion';
import ShipmentForm from './ShipmentForm';

export default function SearchSection({ onSubmit }) {
  return (
    <section id="search" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(30,79,160,0.15) 0%, transparent 60%)' }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-orange-300 border border-orange-500/20 mb-6">
            <span>🔍</span> Instant Quote Comparison
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ship Your <span className="gradient-text">Machinery Today</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Enter your shipment details below and instantly compare quotes from
            verified heavy transport companies near you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ShipmentForm onSubmit={onSubmit} />
        </motion.div>
      </div>
    </section>
  );
}
