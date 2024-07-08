// core/loaders/utils/geojson-loader.ts

import useMapStore from "@/store/engine-store/useMapStore";
import useLandStore from "@/store/world-store/useLandStore";
import { Map } from "mapbox-gl";

export const GeoJsonLoader = (sourceId: string, layerId: string, getColor: (owner_id: number, is_for_sale: boolean) => string) => {
  const { mapbox } = useMapStore.getState();
  const { fetchLands } = useLandStore.getState();
  const loadLandsData = async (map: Map) => {
    try {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
     
      if (zoom < 4) {
        return { type: "FeatureCollection", features: [] };
      }

      const lands = await fetchLands(bounds, zoom);
      console.log("Fetched lands:", lands);
      const geojson = {
        type: "FeatureCollection",
        features: lands
          .map((land) => {
            try {
              return {
                type: "Feature",
                geometry: JSON.parse(land.coordinates),
                properties: {
                  ...land,
                  "fill-color": getColor(land.owner_id, land.is_for_sale),
                },
              };
            } catch (error) {
              console.error("Error parsing land coordinates:", error, land);
              return null;
            }
          })
          .filter((feature) => feature !== null),
      };
      console.log("Generated GeoJSON:", geojson);
      return geojson;
    } catch (error) {
      console.error("Error in loadLandsData:", error);
      return { type: "FeatureCollection", features: [] };
    }
  };

  if (mapbox) {
    mapbox.on("load", async () => {
      const initialData = await loadLandsData(mapbox);
      console.log("Initial GeoJSON data:", initialData);
      console.log("Number of features:", initialData.features.length);
      mapbox.addSource(sourceId, {
        type: "geojson",
        data: initialData as any,
      });

      mapbox.addLayer({
        id: layerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": ["get", "fill-color"],
          "fill-outline-color": "rgba(0, 0, 0, 0.8)",
          "fill-opacity": 0.7,
        },
      });

      mapbox.addLayer({
        id: `${layerId}-border`,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "rgba(0, 0, 0, 1)",
          "line-width": 1,
        },
      });

      mapbox.on("moveend", async () => {
        const newData = await loadLandsData(mapbox);
        (mapbox.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(newData as any);
      });
    });
  }
};
