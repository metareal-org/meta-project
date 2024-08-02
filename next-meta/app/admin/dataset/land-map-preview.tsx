import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface LandMapPreviewProps {
  geoJsonData: any;
}

const GeoJSONLayer: React.FC<{ data: any }> = ({ data }) => {
  const map = useMap();
  
  useEffect(() => {
    if (data) {
      const geoJsonLayer = L.geoJSON(data);
      const bounds = geoJsonLayer.getBounds();
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [data, map]);

  return data ? <GeoJSON data={data} /> : null;
};

const LandMapPreview: React.FC<LandMapPreviewProps> = ({ geoJsonData }) => {
  useEffect(() => {
    import('leaflet').then(L => {
      L.Icon.Default.imagePath = 'leaflet/dist/images/';
    });
  }, []);

  if (!geoJsonData) return null;

  return (
    <MapContainer
      key={JSON.stringify(geoJsonData)} // This forces a re-render when geoJsonData changes
      center={[0, 0]}
      zoom={2}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSONLayer data={geoJsonData} />
    </MapContainer>
  );
};

export default LandMapPreview;