import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    step: '01',
    title: 'Describe Your Shipment',
    description: 'Enter pickup & drop locations, equipment type, and weight. Takes less than 2 minutes.',
    color: '#f97316',
    emoji: '📋',
    detail: 'No registration needed',
  },
  {
    step: '02',
    title: 'Compare Carrier Quotes',
    description: 'Instantly matched with verified heavy haulage carriers. Review ratings, fleet, and pricing.',
    color: '#3b82f6',
    emoji: '⚖️',
    detail: 'Free, no obligation',
  },
  {
    step: '03',
    title: 'Book & Track Live',
    description: 'Confirm your preferred carrier, pay securely, and track your shipment in real-time.',
    color: '#10b981',
    emoji: '🚛',
    detail: 'Real-time GPS tracking',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(30,79,160,0.08) 0%, transparent 60%)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-blue-300 border border-blue-500/20 mb-5">
            <span>🚀</span> Ship in 3 Simple Steps
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            How <span className="gradient-text">ShipGod</span> Works
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            From inquiry to delivery — the simplest way to move heavy industrial equipment across India.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-16 left-[16.66%] right-[16.66%] h-px z-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.25) 15%, rgba(249,115,22,0.25) 85%, transparent)',
            }}
          >
            {/* Arrow heads */}
            <div className="absolute left-1/3 -translate-x-1/2 -top-1.5 text-orange-500/40 text-sm">›</div>
            <div className="absolute left-2/3 -translate-x-1/2 -top-1.5 text-orange-500/40 text-sm">›</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: i * 0.18, ease: 'easeOut' }}
                className="group relative glass rounded-3xl p-8 border border-white/8 hover:border-white/15 transition-all duration-400 text-center overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${step.color}12 0%, transparent 70%)` }} />

                {/* Step number chip */}
                <div className="absolute top-5 right-5 text-xs font-bold tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}25` }}
                >
                  STEP {step.step}
                </div>

                {/* Emoji icon */}
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}20, ${step.color}08)`,
                    border: `1px solid ${step.color}25`,
                    boxShadow: `0 8px 32px ${step.color}15`,
                  }}
                >
                  {step.emoji}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{step.description}</p>

                {/* Detail pill */}
                <div className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ background: `${step.color}12`, color: step.color }}>
                  <span>✓</span> {step.detail}
                </div>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }} />
              </motion.div>
            ))}
          </div>

          {/* Mobile step connectors */}
          <div className="lg:hidden flex flex-col items-center gap-0 mt-0">
            {/* connectors are implicit via vertical layout */}
          </div>
        </div>
      </div>
    </section>
  );
}
