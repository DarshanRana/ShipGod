import { motion } from 'framer-motion';
import { HiTruck, HiPhone, HiMail, HiLocationMarker, HiShieldCheck } from 'react-icons/hi';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaGooglePlay, FaApple } from 'react-icons/fa';

const links = {
  Ship: ['Get Quotes', 'How It Works', 'Track Shipment', 'Service Areas', 'Pricing Guide'],
  Carriers: ['List Your Fleet', 'Driver Portal', 'Partner Program', 'Insurance', 'Carrier Resources'],
  Business: ['Enterprise Solutions', 'API Integration', 'Bulk Shipments', 'Project Logistics', 'OD Cargo'],
  Support: ['Help Center', 'Contact Us', 'Safety & Compliance', 'Trust & Safety', 'API Docs'],
};

const trustItems = [
  { icon: HiShieldCheck, text: 'SSL Secured' },
  { icon: HiShieldCheck, text: 'GST Verified Carriers' },
  { icon: HiShieldCheck, text: '24/7 Support' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, #0a1628 0%, #060e1f 100%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-0">

        {/* App Download Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 border border-orange-500/15 mb-12"
          style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(30,79,160,0.08) 100%)' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-4xl shrink-0">📱</div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-white font-bold text-lg mb-1">Download the ShipGod App</h4>
              <p className="text-slate-400 text-sm">Track shipments, get quotes, and manage logistics — all from your phone.</p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold text-white border border-white/15 hover:border-orange-500/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <FaApple className="text-lg" />
                <div className="text-left">
                  <div className="text-xs text-slate-400 leading-none">Download on the</div>
                  <div className="font-bold text-sm">App Store</div>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold text-white border border-white/15 hover:border-orange-500/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <FaGooglePlay className="text-base" />
                <div className="text-left">
                  <div className="text-xs text-slate-400 leading-none">Get it on</div>
                  <div className="font-bold text-sm">Google Play</div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <HiTruck className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">Ship</span>
                <span className="gradient-text">God</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              India's leading heavy machinery and industrial transport platform.
              Connecting businesses with verified heavy haulage carriers nationwide.
            </p>
            <div className="flex flex-col gap-2 text-slate-400 text-sm mb-5">
              <div className="flex items-center gap-2">
                <HiPhone className="text-orange-400 shrink-0" />
                <span>+91 1800-SHIPGOD</span>
              </div>
              <div className="flex items-center gap-2">
                <HiMail className="text-orange-400 shrink-0" />
                <span>support@shipgod.in</span>
              </div>
              <div className="flex items-center gap-2">
                <HiLocationMarker className="text-orange-400 shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[FaLinkedin, FaTwitter, FaInstagram, FaFacebook].map((Icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-orange-400 border border-white/8 hover:border-orange-500/30 transition-all"
                >
                  <Icon className="text-sm" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-400 text-sm hover:text-orange-400 transition-colors duration-200 group flex items-center gap-1"
                    >
                      <span className="w-0 h-px bg-orange-400 group-hover:w-3 transition-all duration-200" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass rounded-2xl p-6 border border-white/8 mb-0">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg mb-1">Get Heavy Transport Insights</h4>
              <p className="text-slate-400 text-sm">Industry news, carrier updates, and logistics tips delivered weekly.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none border border-white/8 focus:border-orange-500/40 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary px-6 py-3 text-sm rounded-xl whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-5 border-t border-white/[0.05] mt-8">
          {trustItems.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Icon className="text-emerald-500/60 text-sm" /> {text}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 ShipGod Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-500 text-sm">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
