import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi';

const badges = [
  {
    icon: 'G',
    platform: 'Google Reviews',
    rating: '4.9',
    detail: '3,200+ reviews',
    iconColor: '#4285F4',
    isVerified: false,
  },
  {
    platform: 'App Store',
    rating: '4.8',
    detail: '1,800+ ratings',
    iconColor: '#555555',
    isApple: true,
  },
  {
    platform: 'Verified Carriers',
    rating: '2,400+',
    detail: 'Pan-India network',
    iconColor: '#0fa14a',
    isVerified: true,
  },
];

function StarRow() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar key={i} className="text-yellow-400 text-xs" />
      ))}
    </div>
  );
}

export default function TrustBar() {
  return (
    <section className="py-8 px-6 bg-[#f5f6f7] border-b border-gray-200">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 hidden sm:block">
            Trusted Across Platforms:
          </p>

          {badges.map((badge, i) => (
            <motion.div
              key={badge.platform}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 bg-white rounded-xl px-5 py-3.5 border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-default"
            >
              {badge.isVerified ? (
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white text-lg"
                  style={{ background: badge.iconColor }}
                >
                  ✓
                </div>
              ) : badge.isApple ? (
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 text-white text-base">
                  
                </div>
              ) : (
                <div
                  className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 text-base font-extrabold"
                  style={{ color: badge.iconColor }}
                >
                  G
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  {badge.isVerified ? (
                    <span className="text-base font-extrabold" style={{ color: badge.iconColor }}>
                      {badge.rating}
                    </span>
                  ) : (
                    <>
                      <span className="text-base font-extrabold text-[#002f56]">{badge.rating}</span>
                      <StarRow />
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-700 font-semibold leading-tight">{badge.platform}</div>
                <div className="text-xs text-slate-500">{badge.detail}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
