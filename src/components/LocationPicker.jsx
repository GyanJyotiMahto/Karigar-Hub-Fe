import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

const LocationPicker = ({ setAddr }) => {
  const [position, setPosition] = useState(null);

  const MapClick = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();

        setAddr(prev => ({
          ...prev,
          line1: data.display_name || "",
          city: data.address?.city || data.address?.town || "",
          state: data.address?.state || "",
          pincode: data.address?.postcode || "",
          lat,
          lng,
        }));
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-64 w-full rounded-xl">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClick />
    </MapContainer>
  );
};

export default LocationPicker;