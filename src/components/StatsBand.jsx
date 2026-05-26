import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 2400, suffix: '+', label: 'Verified Carriers', icon: '🚛', color: '#0077c8' },
  { value: 10000, suffix: '+', label: 'Shipments Completed', icon: '📦', color: '#0fa14a' },
  { value: 28, suffix: '', label: 'States Covered', icon: '🗺️', color: '#002f56' },
  { value: 4.9, suffix: '★', label: 'Customer Rating', icon: '⭐', color: '#f59e0b', isFloat: true },
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
    <section className="bg-white border-y border-gray-200 py-12">
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
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gray-200" />
              )}

              <div className="text-3xl mb-2">{stat.icon}</div>

              <div
                className="text-3xl md:text-4xl font-extrabold mb-1 tabular-nums"
                style={{ color: stat.color }}
              >
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  isFloat={stat.isFloat}
                />
              </div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
