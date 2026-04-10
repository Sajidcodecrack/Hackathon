import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const RecIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#14b8a6; width:15px; height:15px; border-radius:50%; border:2px solid white; box-shadow:0 0 10px #14b8a6;'></div>",
  iconSize: [15, 15],
  iconAnchor: [7, 7]
});

const PumpIcon = (traffic) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='background-color:${traffic > 70 ? "#ef4444" : traffic > 40 ? "#f59e0b" : "#10b981"}; width:12px; height:12px; border-radius:50%; border:2px solid white;'></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

const RealMap = ({ pumps, location, aiRec }) => {
  const center = location ? [location.lat, location.lng] : [23.8103, 90.4125]; // Default to Dhaka if no location

  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden border-4 border-white shadow-xl mb-6 relative z-10">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Real-time Traffic Simulation Overlay (Visual) */}
        <TileLayer
          url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=bf6f1165a6e8484e857474472d8a0c23"
          opacity={0.4}
        />
        
        <ChangeView center={center} />

        {location && (
          <Marker position={[location.lat, location.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {pumps.map((pump, idx) => {
          const isRec = aiRec?.recommendedPumpIndex === idx;
          const traffic = Math.floor(Math.random() * 100);
          
          // Generate slightly randomized lat/lng around user if pump doesn't have it
          // In a real app, pump.location.coordinates would be used
          const lat = location?.lat + (Math.random() - 0.5) * 0.05;
          const lng = location?.lng + (Math.random() - 0.5) * 0.05;

          return (
            <Marker key={pump._id} position={[lat, lng]} icon={isRec ? RecIcon : PumpIcon(traffic)}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold">{pump.name}</h3>
                  <p className="text-xs text-slate-500">{pump.address}</p>
                  <div className="mt-2 flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${traffic > 70 ? "bg-red-500" : traffic > 40 ? "bg-orange-500" : "bg-green-500"}`}></span>
                     <span className="text-[10px] font-bold">Traffic: {traffic}%</span>
                  </div>
                  {isRec && <p className="text-[10px] font-bold text-primary-600 mt-1">✨ AI RECOMMENDED</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg z-[1000] border border-slate-100 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <div className="w-2 h-2 rounded-full bg-green-500" /> Low Traffic
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <div className="w-2 h-2 rounded-full bg-orange-500" /> Moderate
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold">
            <div className="w-2 h-2 rounded-full bg-red-500" /> High Traffic / Queue
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-primary-600 border-t pt-1">
            <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_5px_#14b8a6]" /> AI Pick
          </div>
      </div>
    </div>
  );
};

export default RealMap;
