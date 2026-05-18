import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { mapPins } from '../data/mockData';
import { HiStar, HiLocationMarker, HiPhone } from 'react-icons/hi';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix Leaflet default marker icons broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Force Leaflet to recalculate container size after mount (fixes blank map when rendered off-screen)
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

// Build a custom SVG marker icon for each pin
function createCustomIcon(color, available) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <defs>
        <filter id="shadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="${color}" flood-opacity="0.45"/>
        </filter>
      </defs>
      <ellipse cx="18" cy="41" rx="8" ry="3" fill="rgba(0,0,0,0.3)"/>
      <path d="M18 2 C10.3 2 4 8.3 4 16 C4 26 18 41 18 41 C18 41 32 26 32 16 C32 8.3 25.7 2 18 2Z"
        fill="${color}" filter="url(#shadow)" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
      <circle cx="18" cy="16" r="7" fill="rgba(255,255,255,0.95)"/>
      <circle cx="18" cy="16" r="4" fill="${color}"/>
      ${available
        ? `<circle cx="27" cy="6" r="5" fill="#10b981" stroke="white" stroke-width="1.5"/>`
        : `<circle cx="27" cy="6" r="5" fill="#64748b" stroke="white" stroke-width="1.5"/>`}
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
  });
}

// Dark tile style via CartoDB Voyager (no API key needed, looks clean)
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Center the map to fit all pins
function FitBounds({ pins }) {
  const map = useMap();
  useEffect(() => {
    if (pins.length) {
      const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [map, pins]);
  return null;
}

export default function MapSection({ sticky = false, onPinClick }) {
  return (
    <div className={`${sticky ? 'lg:sticky lg:top-24' : ''}`}>
      <div className="glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-sm font-semibold text-white">Live Carrier Map</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
              Busy
            </span>
            <span className="text-slate-600">Powered by OpenStreetMap</span>
          </div>
        </div>

        {/* Leaflet Map */}
        <div className="relative" style={{ height: '480px' }}>
          <MapContainer
            center={[19.5, 73.5]}
            zoom={6}
            zoomControl={false}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', background: '#0a1628' }}
          >
            <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
            <ZoomControl position="bottomright" />
            <MapResizer />
            <FitBounds pins={mapPins} />

            {mapPins.map((pin) => (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={createCustomIcon(pin.color, pin.available)}
                eventHandlers={{
                  click: () => onPinClick && onPinClick(pin),
                }}
              >
                <Popup
                  className="shipgod-popup"
                  closeButton={true}
                  maxWidth={220}
                >
                  <div
                    style={{
                      background: '#0c1e3d',
                      border: `1px solid ${pin.color}33`,
                      borderRadius: '12px',
                      padding: '14px',
                      fontFamily: 'Inter, sans-serif',
                      minWidth: '200px',
                    }}
                  >
                    {/* Status dot */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '10px', height: '10px', borderRadius: '50%',
                          background: pin.available ? '#10b981' : '#64748b',
                          boxShadow: pin.available ? '0 0 6px #10b981' : 'none',
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {pin.available ? 'Available Now' : 'Currently Busy'}
                      </span>
                    </div>

                    {/* Name */}
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', lineHeight: 1.3, marginBottom: '6px' }}>
                      {pin.name}
                    </div>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      {'★★★★★'.split('').map((s, i) => (
                        <span key={i} style={{ color: i < Math.floor(pin.rating) ? '#eab308' : '#334155', fontSize: '13px' }}>{s}</span>
                      ))}
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '12px', marginLeft: '2px' }}>{pin.rating}</span>
                    </div>

                    {/* Distance */}
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '10px' }}>
                      📍 {pin.distance} from your location
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => onPinClick && onPinClick(pin)}
                      style={{
                        width: '100%', padding: '7px 0', borderRadius: '8px',
                        background: `linear-gradient(135deg, ${pin.color}, ${pin.color}cc)`,
                        color: '#fff', fontWeight: 600, fontSize: '12px',
                        border: 'none', cursor: 'pointer',
                        boxShadow: `0 4px 12px ${pin.color}40`,
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Custom popup override styles injected globally */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 12px !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.5 !important;
        }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-close-button {
          color: #94a3b8 !important;
          font-size: 18px !important;
          top: 6px !important;
          right: 8px !important;
        }
        .leaflet-popup-close-button:hover { color: #f97316 !important; }
        .leaflet-control-attribution {
          background: rgba(10,22,40,0.8) !important;
          color: #475569 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #64748b !important; }
        .leaflet-bar {
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 10px !important;
          overflow: hidden;
        }
        .leaflet-bar a {
          background: #0c1e3d !important;
          color: #fff !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          width: 32px !important;
          height: 32px !important;
          line-height: 32px !important;
          font-size: 16px !important;
        }
        .leaflet-bar a:hover { background: #f97316 !important; color: #fff !important; }
      `}</style>
    </div>
  );
}
