import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { Star, ShieldCheck, MapPin } from 'lucide-react'

// Custom Modern SVG DivIcon for Service Providers (Red & White Theme)
const createCustomMarker = () => {
  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
        <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: #DC2626; box-shadow: 0 4px 10px rgba(220,38,38,0.45); display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  })
}

// Center Pin for the selected 30km search location (Black & Red Accent)
const createCenterMarker = () => {
  return L.divIcon({
    className: 'center-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
        <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: #0A0A0A; box-shadow: 0 0 15px rgba(220,38,38,0.7); display: flex; align-items: center; justify-content: center; color: #DC2626; border: 3px solid #FFFFFF;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" fill="#DC2626"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })
}

// Helper to pan map when selected location changes
function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 11, { duration: 1.2 })
    }
  }, [center, zoom, map])
  return null
}

// Click on map to pick 30km search center
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

export function TamilNaduMap({
  providers = [],
  selectedLocation = null,
  onSelectMapLocation = null,
  height = '500px',
  radiusKm = 30,
}) {
  const defaultCenter = [11.1271, 78.6569] // Tamil Nadu Geographic Center
  const activeCenter = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : defaultCenter
  const activeZoom = selectedLocation ? 11 : 7

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-neutral-200 shadow-card bg-neutral-100" style={{ height }}>
      {/* Top Map Overlay Badge */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 pointer-events-none">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 text-black shadow-md backdrop-blur-md flex items-center gap-1.5 border border-neutral-200 pointer-events-auto">
          <MapPin className="w-4 h-4 text-red-600" />
          <span>Tamil Nadu Live Service Map</span>
        </span>

        {selectedLocation && (
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-600 text-white shadow-md backdrop-blur-md flex items-center gap-1.5 pointer-events-auto">
            <span>Radius: {radiusKm} km around {selectedLocation.name}</span>
          </span>
        )}
      </div>

      <MapContainer
        center={activeCenter}
        zoom={activeZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={activeCenter} zoom={activeZoom} />
        <MapClickHandler onMapClick={onSelectMapLocation} />

        {/* Selected Location Center & 30km radius circle */}
        {selectedLocation && (
          <>
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={createCenterMarker()}
            />
            <Circle
              center={[selectedLocation.lat, selectedLocation.lng]}
              radius={radiusKm * 1000} // Convert km to meters
              pathOptions={{
                color: '#DC2626',
                fillColor: '#DC2626',
                fillOpacity: 0.12,
                weight: 2.5,
                dashArray: '6, 6',
              }}
            />
          </>
        )}

        {/* Provider Markers */}
        {providers.map((p) => {
          if (!p.latitude || !p.longitude) return null
          return (
            <Marker
              key={p.id}
              position={[p.latitude, p.longitude]}
              icon={createCustomMarker()}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[200px] space-y-1.5 font-sans">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 uppercase">
                    <span>{p.categoryName}</span>
                    {p.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-black" />}
                  </div>
                  <h4 className="font-extrabold text-sm text-black leading-snug">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    📍 {p.locality}, {p.city}
                  </p>
                  {p.distanceKm !== undefined && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200">
                      {p.distanceKm} km away
                    </span>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-neutral-100 text-xs">
                    <span className="font-bold text-black">Starts ₹{p.minPrice}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      <span className="font-bold">{p.rating}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      to={`/business/${p.slug}`}
                      className="block text-center w-full py-1.5 px-3 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-black transition shadow-sm"
                    >
                      View & Book Service
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
