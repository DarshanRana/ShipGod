import { motion } from 'framer-motion';
import { HiTruck, HiShieldCheck, HiLightningBolt, HiGlobe, HiHeart, HiUserGroup } from 'react-icons/hi';

const stats = [
  { value: '2,400+', label: 'Verified Carriers' },
  { value: '15,000+', label: 'Loads Shipped' },
  { value: '28', label: 'States Covered' },
  { value: '4.9★', label: 'Average Rating' },
];

const values = [
  {
    icon: HiShieldCheck,
    title: 'Trust First',
    desc: 'Every carrier on our platform is GST-verified, background-checked, and rated by real customers.',
    color: '#0fa14a',
  },
  {
    icon: HiLightningBolt,
    title: 'Speed & Reliability',
    desc: 'Get competitive quotes in minutes, not days. Our 98% on-time delivery record speaks for itself.',
    color: '#0077c8',
  },
  {
    icon: HiGlobe,
    title: 'Pan-India Reach',
    desc: 'From Kashmir to Kanyakumari — we connect heavy machinery businesses across every state.',
    color: '#f59e0b',
  },
  {
    icon: HiHeart,
    title: 'Customer Obsessed',
    desc: 'Our 24/7 support team is always on call. Your shipment is our responsibility end-to-end.',
    color: '#ef4444',
  },
];

const team = [
  { name: 'Arjun Mehta', role: 'Co-founder & CEO', avatar: 'AM', color: '#0077c8', bio: '15 yrs in logistics & supply chain' },
  { name: 'Priya Sharma', role: 'Co-founder & CTO', avatar: 'PS', color: '#0fa14a', bio: 'Ex-Google engineer, IIT Bombay' },
  { name: 'Rohit Kapoor', role: 'Head of Carrier Network', avatar: 'RK', color: '#f59e0b', bio: 'Built India\'s largest fleet network' },
  { name: 'Sneha Iyer', role: 'Head of Customer Success', avatar: 'SI', color: '#8b5cf6', bio: '10 yrs in enterprise logistics' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function AboutUs({ onGetQuote }) {
  return (
    <div className="pt-20" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>

      {/* ── Hero Banner ── */}
      <section className="relative bg-[#002f56] py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(15,161,74,0.15) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(0,119,200,0.12) 0%, transparent 50%)' }} />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div {...fadeUp}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0fa14a]/20 border border-[#0fa14a]/40 text-[#4ade80] text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0fa14a] animate-pulse" />
            Our Story
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            We're Redefining{' '}
            <span className="text-[#0fa14a]">Heavy Logistics</span>{' '}
            in India
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            ShipGod was born out of frustration with the broken, opaque, and unreliable world of heavy machinery transport in India. We built the platform we always wished existed.
          </motion.p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-[#002f56]" style={{ color: '#002f56' }}>{s.value}</div>
              <div className="text-sm font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0077c8] mb-3">Our Mission</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight" style={{ color: 'var(--text-primary)' }}>
              Connecting India's Industries with Trusted Transport
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              India's infrastructure boom demands a logistics backbone that's fast, transparent, and reliable. ShipGod is that backbone — a technology-first marketplace that connects businesses shipping cranes, excavators, generators, and industrial machinery with verified heavy haulage carriers.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              We eliminate middlemen, bring real-time visibility, and ensure every shipment is backed by insurance, tracking, and our 24/7 support team.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl p-8 border"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            <div className="w-14 h-14 rounded-xl bg-[#0fa14a] flex items-center justify-center mb-6">
              <HiTruck className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Founded in 2022</h3>
            <div className="space-y-4">
              {[
                { year: '2022', event: 'Founded in Mumbai by logistics veterans' },
                { year: '2023', event: 'Reached 500 verified carriers across 10 states' },
                { year: '2024', event: 'Crossed 10,000 successful shipments' },
                { year: '2025', event: 'Pan-India presence — 28 states, 2,400+ carriers' },
              ].map(({ year, event }) => (
                <div key={year} className="flex gap-4 items-start">
                  <span className="text-xs font-bold text-[#0fa14a] bg-[#0fa14a]/10 px-2 py-1 rounded shrink-0">{year}</span>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{event}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0077c8] mb-3">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Our Core Values</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="rounded-xl p-6 border transition-all duration-300"
                style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)' }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${v.color}18` }}
                >
                  <v.icon className="text-xl" style={{ color: v.color }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0077c8] mb-3">The People Behind It</p>
            <h2 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Meet Our Team</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="rounded-xl p-6 border text-center transition-all duration-300"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mx-auto mb-4"
                  style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}90)` }}
                >
                  {member.avatar}
                </div>
                <h3 className="font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{member.name}</h3>
                <p className="text-xs font-semibold text-[#0077c8] mb-2">{member.role}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-[#002f56]">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to Ship Smarter?
          </h2>
          <p className="text-blue-100/70 mb-8 text-lg">
            Join 15,000+ businesses that trust ShipGod for their heavy logistics needs.
          </p>
          <button
            onClick={onGetQuote}
            className="inline-flex items-center gap-2 bg-[#0fa14a] hover:bg-[#0d8a3f] text-white font-bold px-10 py-4 rounded-xl text-base transition-all duration-200 hover:shadow-lg hover:shadow-green-900/30 hover:-translate-y-0.5"
          >
            <HiTruck className="text-xl" />
            Get a Free Quote
          </button>
        </motion.div>
      </section>

    </div>
  );
}
