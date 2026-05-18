import { motion } from 'framer-motion';
import { HiShieldCheck } from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';

const badges = [
  {
    icon: '🅶',
    platform: 'Google Reviews',
    rating: '4.9',
    detail: '3,200+ reviews',
    color: '#4285F4',
    useGoogle: true,
  },
  {
    icon: '🍎',
    platform: 'App Store',
    rating: '4.8',
    detail: '1,800+ ratings',
    color: '#555555',
    useApple: true,
  },
  {
    platform: 'Verified Carriers',
    rating: '2,400+',
    detail: 'Pan-India network',
    color: '#10b981',
    isVerified: true,
  },
];

function StarRow({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar key={i} className="text-yellow-400 text-xs" />
      ))}
    </div>
  );
}

export default function TrustBar() {
  return (
    <section className="py-8 px-6"
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0d2040 100%)' }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
        >
          {/* Label */}
          <div className="text-slate-400 text-sm font-medium whitespace-nowrap hidden sm:block">
            Trusted across platforms:
          </div>

          {badges.map((badge, i) => (
            <motion.div
              key={badge.platform}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -3 }}
              className="flex items-center gap-3 glass rounded-2xl px-5 py-3 border border-white/8 hover:border-white/15 transition-all cursor-default"
            >
              {badge.isVerified ? (
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${badge.color}20` }}
                >
                  <HiShieldCheck style={{ color: badge.color }} className="text-xl" />
                </div>
              ) : badge.useGoogle ? (
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-lg font-bold"
                  style={{ color: badge.color }}>
                  G
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-lg">
                  🍎
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  {badge.isVerified ? (
                    <span className="text-base font-extrabold" style={{ color: badge.color }}>
                      {badge.rating}
                    </span>
                  ) : (
                    <>
                      <span className="text-base font-extrabold text-white">{badge.rating}</span>
                      <StarRow />
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-400 leading-tight">{badge.platform}</div>
                <div className="text-xs text-slate-500">{badge.detail}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
