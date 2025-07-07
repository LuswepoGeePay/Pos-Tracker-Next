'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useMemo, useRef } from 'react'

// Fix for default Leaflet icon not showing
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: (typeof icon === 'string' ? icon : icon.src),
  shadowUrl: (typeof iconShadow === 'string' ? iconShadow : iconShadow.src),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon
interface DeviceMapProps {
  latitude: number
  longitude: number
  name?: string
}

const DeviceMap: React.FC<DeviceMapProps> = ({ latitude, longitude, name }) => {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Validate latitude and longitude
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return <div>Invalid coordinates provided</div>
  }

  // Memoize the map center to prevent unnecessary re-renders
  const center = useMemo(() => [latitude, longitude] as [number, number], [latitude, longitude])

  useEffect(() => {
    // Cleanup map instance on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove() // Explicitly remove the map instance
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div ref={containerRef} style={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
             >
        <TileLayer
          attribution='© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>
            {name ?? 'POS Device'} <br /> Lat: {latitude}, Lng: {longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default DeviceMap