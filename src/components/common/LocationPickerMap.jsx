import React, { useState, useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Navigation, CheckCircle2, Crosshair, Search } from 'lucide-react'
import { LocationAutocomplete } from './LocationAutocomplete'
import { findNearestLocation, TAMIL_NADU_LOCATIONS } from '@/data/tamilNaduLocations'

// Interactive Shop Pin (Draggable, Red & White Theme)
const createShopPickerMarker = () => {
  return L.divIcon({
    className: 'picker-pin',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 44px; height: 50px; cursor: grab;">
        <div style="width: 40px; height: 40px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: #DC2626; box-shadow: 0 4px 15px rgba(220,38,38,0.6); display: flex; align-items: center; justify-content: center; border: 3px solid #FFFFFF;">
          <div style="transform: rotate(45deg); color: white; display: flex; align-items: center; justify-content: center;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
        </div>
        <div style="width: 14px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%; margin-top: -3px; filter: blur(1px);"></div>
      </div>
    `,
    iconSize: [44, 50],
    iconAnchor: [22, 48],
  })
}

// Controller to smoothly fly to new coordinates
function MapFlyController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 14, { duration: 1 })
    }
  }, [center, zoom, map])
  return null
}

// Map click event listener to update pin position
function MapClickHandler({ onSelectCoords }) {
  useMapEvents({
    click: (e) => {
      onSelectCoords(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)))
    },
  })
  return null
}

/**
 * Interactive Map Location Picker for Business Registration & Editing
 * Replaces manual address writing with map-based pin selection
 */
export function LocationPickerMap({
  initialLat = null,
  initialLng = null,
  onLocationChange,
  height = '380px',
  label = 'Select Your Shop / Service Location on Map *'
}) {
  const defaultCenter = [11.1271, 78.6569] // Tamil Nadu Geographic Center (No default city)
  const [position, setPosition] = useState(
    initialLat && initialLng ? [initialLat, initialLng] : defaultCenter
  )
  const [hasPicked, setHasPicked] = useState(Boolean(initialLat && initialLng))
  const [zoomLevel, setZoomLevel] = useState(initialLat && initialLng ? 13 : 7)
  const [locatingUser, setLocatingUser] = useState(false)
  const [selectedTownInfo, setSelectedTownInfo] = useState(() => {
    if (initialLat && initialLng) {
      return findNearestLocation(initialLat, initialLng)
    }
    return null
  })
  const markerRef = useRef(null)

  // Update position if initial coordinates change externally
  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition([initialLat, initialLng])
      const nearest = findNearestLocation(initialLat, initialLng)
      setSelectedTownInfo(nearest)
      setHasPicked(true)
    }
  }, [initialLat, initialLng])

  // When coordinates change, resolve nearest town & notify parent
  const handleCoordsUpdate = (lat, lng, townOverride = null) => {
    setPosition([lat, lng])
    const nearest = townOverride 
      ? { location: townOverride, distanceKm: 0 } 
      : findNearestLocation(lat, lng)

    setSelectedTownInfo(nearest)

    if (onLocationChange) {
      const town = nearest.location
      const distanceNotice = nearest.distanceKm > 1 ? ` (${nearest.distanceKm} km from ${town.name})` : ''
      const generatedAddress = `${town.name}${distanceNotice}, ${town.district} District, Tamil Nadu - ${town.postal || '600001'}`

      onLocationChange({
        latitude: lat,
        longitude: lng,
        locality: town.name,
        city: town.district,
        district: town.district,
        postalCode: town.postal || '600001',
        address: generatedAddress,
        displayLocation: `${town.name}, ${town.district}`
      })
    }
  }

  // Handle marker dragend
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const latlng = marker.getLatLng()
          handleCoordsUpdate(Number(latlng.lat.toFixed(6)), Number(latlng.lng.toFixed(6)))
        }
      },
    }),
    []
  )

  // Quick Action: Locate My Device / Current Shop via GPS
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setLocatingUser(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6))
        const lng = Number(pos.coords.longitude.toFixed(6))
        setZoomLevel(15)
        handleCoordsUpdate(lat, lng)
        setLocatingUser(false)
      },
      (err) => {
        console.warn('Geolocation failed:', err)
        setLocatingUser(false)
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }

  // Handle Town selection from the quick typeahead
  const handleTownSelect = (loc) => {
    if (loc && loc.lat && loc.lng) {
      setZoomLevel(14)
      handleCoordsUpdate(loc.lat, loc.lng, loc)
    }
  }

  return (
    <div className="space-y-3 w-full">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <label className="block text-xs font-black text-black uppercase tracking-wider">
            {label}
          </label>
          <p className="text-[11px] text-neutral-500 font-medium">
            Tap anywhere on the map or drag the pin directly to your shop.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLocateMe}
          disabled={locatingUser}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-black hover:text-white text-neutral-800 text-xs font-bold transition shadow-sm border border-neutral-200"
        >
          <Crosshair className={`w-3.5 h-3.5 text-red-600 ${locatingUser ? 'animate-spin' : ''}`} />
          <span>{locatingUser ? 'Detecting GPS...' : 'Locate My Shop (GPS)'}</span>
        </button>
      </div>

      {/* Town Search Bar above map */}
      <div className="relative z-20">
        <LocationAutocomplete
          placeholder="Jump to town/district (e.g. Karaikudi, Sivagangai, Madurai, Anna Nagar)..."
          onSelect={handleTownSelect}
          inputClassName="py-2 text-xs"
        />
      </div>

      {/* Interactive Map Container */}
      <div 
        className="relative w-full rounded-2xl overflow-hidden border-2 border-neutral-300 shadow-md bg-neutral-100" 
        style={{ height }}
      >
        {/* Floating Instruction Pill on Map */}
        <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 pointer-events-none">
          <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-black text-white shadow-lg flex items-center gap-1.5 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Click map or drag pin to position</span>
          </span>
        </div>

        <MapContainer
          center={position}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          className="w-full h-full cursor-crosshair"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFlyController center={position} zoom={zoomLevel} />
          <MapClickHandler onSelectCoords={handleCoordsUpdate} />

          {/* Draggable Shop Pin */}
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={createShopPickerMarker()}
          />

          {/* 30 km Service Radius Visualizer */}
          <Circle
            center={position}
            radius={30000} // 30 km in meters
            pathOptions={{
              color: '#DC2626',
              fillColor: '#DC2626',
              fillOpacity: 0.1,
              weight: 2,
              dashArray: '6, 6',
            }}
          />
        </MapContainer>
      </div>

      {/* Live Selected Coordinates & Location Banner */}
      <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-black flex items-center gap-1.5">
              <span>
                {selectedTownInfo?.location
                  ? `${selectedTownInfo.location.name}, ${selectedTownInfo.location.district}`
                  : 'Click on the map or search a town above to set shop location'}
              </span>
              {selectedTownInfo && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                  30 km Coverage
                </span>
              )}
            </div>
            <div className="text-[11px] text-neutral-500 font-medium">
              {hasPicked ? (
                <>GPS Coordinates: <strong className="text-neutral-800">{position[0]?.toFixed?.(4) || position[0]}, {position[1]?.toFixed?.(4) || position[1]}</strong></>
              ) : (
                <span className="text-neutral-400">No location chosen yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-600 sm:self-center">
          <CheckCircle2 className={`w-3.5 h-3.5 ${hasPicked ? 'text-red-600' : 'text-neutral-300'}`} />
          <span>{hasPicked ? 'Location selected on Tamil Nadu map' : 'Select a location on map'}</span>
        </div>
      </div>
    </div>
  )
}
