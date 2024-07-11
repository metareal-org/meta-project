import useMapStore from "@/store/engine-store/useMapStore";
import useLandStore, { LandWithDetails } from "@/store/world-store/useLandStore";
import { Map, LngLatBounds } from "mapbox-gl";
import * as turf from "@turf/turf";
import { Feature, Geometry } from "geojson";
import { useUserStore } from "@/store/player-store/useUserStore";

type BBox = [number, number, number, number];

type LandFeature = Feature<Geometry, LandWithDetails>;

export const GeoJsonLoader = (sourceId: string, layerId: string) => {
  const { mapbox } = useMapStore.getState();
  const { fetchLands } = useLandStore.getState();
  let lastRequest: string | null = null;
  let timeoutId: NodeJS.Timeout | null = null;
  const expandBounds = (bounds: LngLatBounds, factor: number = 1.5): LngLatBounds => {
    const bbox: BBox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
    const expanded = turf.transformScale(turf.bboxPolygon(bbox), factor);
    const [minLng, minLat, maxLng, maxLat] = turf.bbox(expanded);
    return new LngLatBounds([minLng, minLat], [maxLng, maxLat]);
  };

  const loadLandsData = async (map: Map) => {
    const bounds = expandBounds(map.getBounds());
    const zoom = map.getZoom();
    const currentRequest = `${bounds.toString()}-${zoom}`;

    const getColorForLand = (owner_id: number, is_for_sale: boolean) => {
      const user = useUserStore.getState().user;
      if (!user) return "#132836";
      if (owner_id === user.id && !is_for_sale) return "navy";
      if (owner_id === user.id && is_for_sale) return "orange";
      if (owner_id !== user.id && !is_for_sale) return "#134255";
      if (owner_id !== user.id && is_for_sale) return "green";
      return "#132836";
    };

    if (currentRequest === lastRequest) {
      console.log("Skipping reload for the same area");
      return;
    }

    lastRequest = currentRequest;

    if (zoom < 4) {
      return { type: "FeatureCollection", features: [] };
    }

    try {
      const lands = await fetchLands(bounds, zoom);
      const geojson = turf.featureCollection(
        lands
          .map((land): LandFeature | null => {
            try {
              return turf.feature(JSON.parse(land.coordinates), {
                ...land,
                "fill-color": getColorForLand(land.owner_id, land.is_for_sale),
              }) as LandFeature;
            } catch (error) {
              console.error("Error parsing land coordinates:", error, land);
              return null;
            }
          })
          .filter((feature): feature is LandFeature => feature !== null)
      );

      if (mapbox && mapbox.getSource(sourceId)) {
        (mapbox.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
      }
    } catch (error) {
      console.error("Error in loadLandsData:", error);
    }
  };

  if (mapbox) {
    mapbox.on("load", async () => {
      try {
        await loadLandsData(mapbox);
        if (!mapbox.getSource(sourceId)) {
          mapbox.addSource(sourceId, {
            type: "geojson",
            data: turf.featureCollection([]),
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
        }

        const scheduleLoadLandsData = () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            loadLandsData(mapbox);
            timeoutId = null;
          }, 500);
        };

        mapbox.on("movestart", () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        });

        mapbox.on("moveend", scheduleLoadLandsData);
      } catch (error) {
        console.error("Error in mapbox load event handler:", error);
      }
    });
  }
};
