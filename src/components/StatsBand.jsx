import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 2400, suffix: '+', label: 'Verified Carriers', icon: '🚛', color: '#f97316' },
  { value: 10000, suffix: '+', label: 'Shipments Completed', icon: '📦', color: '#3b82f6' },
  { value: 28, suffix: '', label: 'States Covered', icon: '🗺️', color: '#10b981' },
  { value: 4.9, suffix: '★', label: 'Customer Rating', icon: '⭐', color: '#eab308', isFloat: true },
];

function Counter({ target, suffix, duration = 2, isFloat }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView) return;
    setStarted(true);
  }, [inView]);

  useEffect(() => {
    if (!started) return;
    const step = target / (duration * 60);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [started, target, duration, isFloat]);

  return (
    <span ref={ref}>
      {isFloat ? count.toFixed(1) : count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

export default function StatsBand() {
  return (
    <section className="relative py-12 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060e1f 0%, #0a1628 50%, #060e1f 100%)' }}
    >
      {/* top/bottom borders */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.4), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.4), transparent)' }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Vertical divider (except last) */}
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px"
                  style={{ background: 'rgba(255,255,255,0.08)' }} />
              )}

              <div
                className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300"
              >{stat.icon}</div>

              <div
                className="text-3xl md:text-4xl font-extrabold mb-1 tabular-nums"
                style={{ color: stat.color, textShadow: `0 0 24px ${stat.color}60` }}
              >
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  isFloat={stat.isFloat}
                />
              </div>
              <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
