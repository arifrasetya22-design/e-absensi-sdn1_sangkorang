import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapViewProps {
  schoolLat: number;
  schoolLng: number;
  schoolName: string;
  userLat?: number;
  userLng?: number;
  radiusMeter: number;
  distanceMeters?: number;
  onSelectUserCoords?: (lat: number, lng: number) => void;
  heightClass?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  schoolLat,
  schoolLng,
  schoolName,
  userLat,
  userLng,
  radiusMeter,
  distanceMeters,
  onSelectUserCoords,
  heightClass = 'h-64'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map instance if exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const centerLat = userLat || schoolLat;
    const centerLng = userLng || schoolLng;

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 17,
      zoomControl: true
    });
    mapRef.current = map;

    // OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Custom Icon for School
    const schoolIcon = L.divIcon({
      className: 'custom-school-pin',
      html: `
        <div style="background-color: #2563EB; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 18px;">
          🏫
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    // School Marker
    const schoolMarker = L.marker([schoolLat, schoolLng], { icon: schoolIcon }).addTo(map);
    schoolMarker.bindPopup(`<b>${schoolName}</b><br/>Titik Pusat Presensi Radius ${radiusMeter}m`).openPopup();

    // School Radius Circle
    L.circle([schoolLat, schoolLng], {
      color: '#2563EB',
      fillColor: '#3B82F6',
      fillOpacity: 0.15,
      radius: radiusMeter,
      weight: 2,
      dashArray: '5, 5'
    }).addTo(map);

    // User Marker
    if (userLat !== undefined && userLng !== undefined) {
      const isInside = (distanceMeters ?? 0) <= radiusMeter;
      const userColor = isInside ? '#22C55E' : '#EF4444';

      const userIcon = L.divIcon({
        className: 'custom-user-pin',
        html: `
          <div style="background-color: ${userColor}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 16px;">
            📍
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = L.marker([userLat, userLng], {
        icon: userIcon,
        draggable: !!onSelectUserCoords
      }).addTo(map);

      userMarker.bindPopup(
        `<b>Posisi Anda Saat Ini</b><br/>Jarak: ${distanceMeters ?? '-'}m ${isInside ? '🟢 (Dalam Radius)' : '🔴 (Luar Radius)'}`
      );

      if (onSelectUserCoords) {
        userMarker.on('dragend', (e) => {
          const newPos = e.target.getLatLng();
          onSelectUserCoords(newPos.lat, newPos.lng);
        });
      }
    }

    // Allow click to reposition user marker in testing mode
    if (onSelectUserCoords) {
      map.on('click', (e) => {
        onSelectUserCoords(e.latlng.lat, e.latlng.lng);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [schoolLat, schoolLng, schoolName, userLat, userLng, radiusMeter, distanceMeters]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-10`} />
      
      {/* Legend Badge Overlay */}
      <div className="absolute bottom-2 left-2 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] shadow-md flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
          <span className="text-slate-700 font-medium">Sekolah ({radiusMeter}m)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span className="text-slate-700 font-medium">Lokasi Anda</span>
        </div>
      </div>
    </div>
  );
};
