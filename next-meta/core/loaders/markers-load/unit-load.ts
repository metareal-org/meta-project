import useMapStore from "@/store/engine-store/useMapStore";
import mapboxgl from "mapbox-gl";
import useUnitStore from "@/store/world-store/useUnitStore";

export default function loadUnit() {
  const { mapbox } = useMapStore.getState();
  const { createMarkerElement, updateMarkerSize, setMarker, setMarkerVisibility } = useUnitStore.getState();

  if (mapbox) {
    const marker = new mapboxgl.Marker({
      element: createMarkerElement(),
    })
      .setLngLat(useUnitStore.getState().unitCoordinates)
      .addTo(mapbox);
    setMarker(marker, mapbox);
    mapbox.on("zoom", () => {
      const zoom = mapbox.getZoom();
      updateMarkerSize(marker, zoom);
    });
    const initialZoom = mapbox.getZoom();
    updateMarkerSize(marker, initialZoom);
  }
}
