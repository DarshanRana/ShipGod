import { motion } from 'framer-motion';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';

const bullets = [
  'Free quotes, no registration required',
  '2,400+ verified heavy haulage carriers',
  'Real-time GPS tracking & live updates',
  'Dedicated support 24/7 for every shipment',
];

export default function CTASection({ onGetStarted }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
          style={{ border: '1px solid rgba(249,115,22,0.2)' }}
        >
          {/* Background */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(10,22,40,0.97) 0%, rgba(15,32,68,0.97) 100%)' }} />

          {/* Animated blobs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.2) 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 15, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(30,79,160,0.3) 0%, transparent 70%)' }}
          />

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Content — split layout */}
          <div className="relative z-10 grid lg:grid-cols-2 gap-0 items-stretch">
            {/* Left — text content */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-5xl mb-5"
              >
                🚛
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.22 }}
                className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-snug"
              >
                Ready to Ship Your<br />
                <span className="gradient-text">Heavy Equipment?</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.28 }}
                className="text-slate-400 text-base mb-6 max-w-md"
              >
                Join 10,000+ businesses that trust ShipGod. Get matched with verified carriers in under 2 minutes.
              </motion.p>

              {/* Bullet points */}
              <motion.ul
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.34 }}
                className="space-y-2.5 mb-8"
              >
                {bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <HiCheckCircle className="text-orange-400 text-lg shrink-0" />
                    {b}
                  </li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.42 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onGetStarted}
                  className="btn-primary flex items-center justify-center gap-2 px-7 py-4 text-base rounded-xl"
                >
                  Get Free Quotes Now <HiArrowRight />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary flex items-center justify-center gap-2 px-7 py-4 text-base rounded-xl"
                >
                  List Your Fleet
                </motion.button>
              </motion.div>

              <p className="text-slate-600 text-xs mt-4">No credit card required · Free to compare · Cancel anytime</p>
            </div>

            {/* Right — image panel */}
            <div className="hidden lg:block relative overflow-hidden">
              <img
                src="/hero_truck.png"
                alt="Heavy equipment transport"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center' }}
              />
              {/* Overlay */}
              <div className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, rgba(10,22,40,0.85) 0%, rgba(10,22,40,0.2) 50%, rgba(10,22,40,0.4) 100%)',
                }}
              />
              {/* Stats overlay */}
              <div className="absolute bottom-8 right-8 glass-strong rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-extrabold gradient-text">₹18,000</div>
                <div className="text-xs text-slate-400">Avg. starting price</div>
                <div className="text-xs text-emerald-400 mt-1">✓ Instant quote</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
