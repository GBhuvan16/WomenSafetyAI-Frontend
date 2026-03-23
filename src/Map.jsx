import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Fix marker icon issue (important)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapComponent() {
  const [position, setPosition] = useState(null);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  };

  return (
    <div style={{ margin: "10px", fontSize:"12px" }}>
     <button style={{ fontSize: "25px", padding: "6px 10px" }} onClick={getLocation}>
  📍
</button>

      {position && (
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "200px", width: "100%", marginTop: "10px", borderRadius: "10px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          <Marker position={position}>
            <Popup>You are here 📍</Popup>
          </Marker>

        </MapContainer>
      )}
    </div>
  );
}

export default MapComponent;