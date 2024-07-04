import axios from "axios";
import useMapStore from "@/store/engine-store/useMapStore";

interface CustomProperties {
  fid: number;
  "fill-color": string;
  owner_id?: number;
  is_for_sale?: boolean;
}

export const GeoJsonLoader = <T>(
  url: string,
  sourceId: string,
  layerId: string,
  entityMap: { [key: number]: T & { owner_id: number; is_for_sale: boolean } },
  getColor: (owner_id: number, is_for_sale: boolean) => string
) => {
  const { mapbox } = useMapStore.getState();

  if (mapbox) {
    mapbox.on("load", () => {
      axios
        .get(url)
        .then((response) => {
          const data = response.data;

          data.features.forEach((feature: GeoJSON.Feature<GeoJSON.Geometry, CustomProperties>) => {
            const fid = feature.properties.fid;
            const entity = entityMap[fid] || { owner_id: 100, is_for_sale: false };

            feature.properties = {
              ...feature.properties,
              ...entity,
              "fill-color": getColor(entity.owner_id, entity.is_for_sale),
            };
          });

          mapbox.addSource(sourceId, {
            type: "geojson",
            data: data,
          });

          mapbox.addLayer({
            id: layerId,
            type: "fill",
            source: sourceId,
            paint: {
              "fill-color": ["case", ["has", "fill-color"], ["get", "fill-color"], "rgba(0, 0, 0, 0.1)"],
              "fill-outline-color": "rgba(0, 0, 0, 0.5)",
            },
          });
        })
        .catch((error) => {
          console.error(`Error loading ${url}:`, error);
        });
    });
  }
};
