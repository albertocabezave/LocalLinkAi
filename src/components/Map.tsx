
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Business, Driver, LatLngPosition } from '../types';

// Custom SVG Icons
const businessIcon = new L.DivIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-blue-600"><path fill-rule="evenodd" d="M9.315 7.584C12.195 3.883 19.5 3.5 19.5 3.5s.383 7.305-3.318 10.185A10.5 10.5 0 0 1 9.315 7.584ZM12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z" clip-rule="evenodd" /></svg>`,
  className: 'bg-transparent border-0',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const driverIcon = new L.DivIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 text-green-500"><path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 5.25 0h1.75a3 3 0 1 1 5.25 0h.375c1.035 0 1.875-.84 1.875-1.875V15h-6.75ZM15 6.375V13.5h6.75V6.375c0-1.036-.84-1.875-1.875-1.875h-3.125c-.384 0-.751.103-1.061.286A2.25 2.25 0 0 0 15 6.375Z" /></svg>`,
  className: 'bg-transparent border-0',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const userIcon = new L.DivIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-purple-600"><path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" /></svg>`,
    className: 'bg-transparent border-0',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});


interface MapUpdaterProps {
  driverPosition: LatLngPosition | null;
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ driverPosition }) => {
  const map = useMap();
  useEffect(() => {
    if (driverPosition) {
      map.flyTo([driverPosition.lat, driverPosition.lng], 16, {
        animate: true,
        duration: 1
      });
    }
  }, [driverPosition, map]);
  return null;
};


interface MapProps {
  center: LatLngPosition;
  businesses: Business[];
  selectedDriver: Driver | null;
  driverPosition: LatLngPosition | null;
  userPosition: LatLngPosition;
}

const MapComponent: React.FC<MapProps> = ({ center, businesses, selectedDriver, driverPosition, userPosition }) => {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={14} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User Marker */}
      <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
        <Popup>Your Location</Popup>
      </Marker>

      {/* Business Markers */}
      {!selectedDriver && businesses.map(business => (
        <Marker key={business.id} position={[business.location.lat, business.location.lng]} icon={businessIcon}>
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-base">{business.name}</h3>
              <p className="text-sm text-gray-600">{business.category}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Driver Marker */}
      {selectedDriver && driverPosition && (
        <Marker position={[driverPosition.lat, driverPosition.lng]} icon={driverIcon} zIndexOffset={1000}>
           <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-base">{selectedDriver.name}</h3>
              <p className="text-sm text-gray-600">{selectedDriver.vehicle.model}</p>
            </div>
          </Popup>
        </Marker>
      )}
      <MapUpdater driverPosition={driverPosition} />
    </MapContainer>
  );
};

export default MapComponent;
