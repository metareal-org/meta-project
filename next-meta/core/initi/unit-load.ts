import useMapStore from "@/store/engine-store/useMapStore";
import mapboxgl from "mapbox-gl";
import useUnitStore from "@/store/world-store/useUnitStore";

export default function loadUnit() {
  const { mapbox } = useMapStore.getState();
  const { createMarkerElement, updateMarkerSize, setMarker, setMarkerVisibility } = useUnitStore.getState();

  // if (mapbox) {
  //   const lat = 35.71999850180396;
  //   const lng = 51.42054437269397;

  //   const marker = new mapboxgl.Marker({
  //     element: createMarkerElement(),
  //   })
  //     .setLngLat([lng, lat])
  //     .addTo(mapbox);

  //   setMarker(marker, mapbox);
  //   mapbox.on("zoom", () => {
  //     const zoom = mapbox.getZoom();
  //     updateMarkerSize(marker, zoom);
  //   });
  //   setMarkerVisibility(false);

  //   const initialZoom = mapbox.getZoom();
  //   updateMarkerSize(marker, initialZoom);
  // }
}
