import { HiTruck, HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';



export default function Footer() {
  return (
    <footer className="bg-[#002f56] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#0fa14a] flex items-center justify-center">
                <HiTruck className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">Ship</span>
                <span className="text-[#0fa14a]">God</span>
              </span>
            </div>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-5">
              India's leading heavy machinery and industrial transport platform.
              Connecting businesses with verified heavy haulage carriers nationwide.
            </p>
            <div className="flex flex-col gap-2 text-blue-200/70 text-sm mb-5">
              <div className="flex items-center gap-2">
                <HiPhone className="text-[#0fa14a] shrink-0" />
                <span>+91 1800-SHIPGOD</span>
              </div>
              <div className="flex items-center gap-2">
                <HiMail className="text-[#0fa14a] shrink-0" />
                <span>support@shipgod.in</span>
              </div>
              <div className="flex items-center gap-2">
                <HiLocationMarker className="text-[#0fa14a] shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[FaLinkedin, FaTwitter, FaInstagram, FaFacebook].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-blue-200/70 hover:text-white hover:bg-[#0077c8] border border-white/10 transition-all"
                >
                  <Icon className="text-sm" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
