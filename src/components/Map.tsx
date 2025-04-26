'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

// Fix leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Position {
  lat: number;
  lng: number;
  address: string;
}

const addresses: string[] = [
  "Zagreb Zagorska 5",
  "Zagreb Jarunska 5",
  "Zagreb Sajmišna ulica 56",
  "Zagreb Masarykova 22/3",
  "Zagreb Svetog Mateja 86",
  "Zagreb Klanječka ulica BB",
  "Zagreb Avenija Marina Držića 102",
  "Zagreb Malomlačka 91",
  "Zagreb Brezovička cesta 96a",
  "Zagreb Jezerska ulica 6a",
];

export default function Map() {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    const geocodeAddresses = async () => {
      const results = await Promise.all(
        addresses.map(async (address): Promise<Position | null> => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
            );
            const data = await response.json();
            
            if (Array.isArray(data) && data.length > 0) {
              return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                address: address,
              };
            }
          } catch (error) {
            console.error('Error geocoding address:', error);
          }
          return null;
        })
      );
      
      setPositions(results.filter((result): result is Position => result !== null));
    };

    geocodeAddresses();
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <MapContainer
        center={[45.8150, 15.9819]} // Zagreb coordinates
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.map((position, index) => (
          <Marker key={index} position={[position.lat, position.lng]}>
            <Popup>
              {position.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}