import useMapStore from "@/store/engine-store/useMapStore";
import useLandStore, { LandWithDetails } from "@/store/world-store/useLandStore";
import { Map as MapboxMap, LngLatBounds } from "mapbox-gl";
import * as turf from "@turf/turf";
import { Feature, Geometry } from "geojson";
import { useUserStore } from "@/store/player-store/useUserStore";
import { DEBUG } from "@/core/constants";

type BBox = [number, number, number, number];
type LandFeature = Feature<Geometry, LandWithDetails>;

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const GeoJsonLoader = (sourceId: string, layerId: string) => {
  const { mapbox } = useMapStore.getState();
  const { fetchLands } = useLandStore.getState();
  let lastRequest: string | null = null;
  let lastRequestTime: number = 0;
  const cache: Record<string, { geojson: any; timestamp: number }> = {};
  const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes
  const COOLDOWN_PERIOD = 1000; // 2 seconds

  const expandBounds = (bounds: LngLatBounds, factor: number = 2): LngLatBounds => {
    const bbox: BBox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
    const expanded = turf.transformScale(turf.bboxPolygon(bbox), factor);
    const [minLng, minLat, maxLng, maxLat] = turf.bbox(expanded);
    return new LngLatBounds([minLng, minLat], [maxLng, maxLat]);
  };

  const roundCoordinate = (coord: number): number => {
    return Number(coord.toFixed(4));
  };

  const getColorForLand = (owner_id: number, is_for_sale: boolean) => {
    const user = useUserStore.getState().user;
    if (!user) return "#132836";
    if (owner_id === user.id && !is_for_sale) return "navy";
    if (owner_id === user.id && is_for_sale) return "orange";
    if (owner_id !== user.id && !is_for_sale) return "#134255";
    if (owner_id !== user.id && is_for_sale) return "green";
    return "#132836";
  };

  const loadLandsData = async (map: MapboxMap) => {
    const currentTime = Date.now();
    if (currentTime - lastRequestTime < COOLDOWN_PERIOD) {
      DEBUG && console.log("Skipping request due to cooldown period");
      return;
    }

    const bounds = expandBounds(map.getBounds());
    const zoom = Math.floor(map.getZoom());
    const currentRequest = `${roundCoordinate(bounds.getWest())},${roundCoordinate(bounds.getSouth())},${roundCoordinate(bounds.getEast())},${roundCoordinate(bounds.getNorth())},${zoom}`;

    if (currentRequest === lastRequest || zoom < 4) {
      DEBUG && console.log("Skipping reload for the same area or low zoom");
      return;
    }

    lastRequest = currentRequest;
    lastRequestTime = currentTime;

    if (cache[currentRequest]) {
      const cachedData = cache[currentRequest];
      if (currentTime - cachedData.timestamp < CACHE_EXPIRATION) {
        DEBUG && console.log("Using cached data");
        updateMapData(cachedData.geojson);
        return;
      } else {
        delete cache[currentRequest];
      }
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

      cache[currentRequest] = { geojson, timestamp: currentTime };
      updateMapData(geojson);
    } catch (error) {
      console.error("Error in loadLandsData:", error);
    }
  };

  const updateMapData = (geojson: any) => {
    if (mapbox && mapbox.getSource(sourceId)) {
      requestAnimationFrame(() => {
        (mapbox.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(geojson);
      });
    }
  };

  const debouncedLoadLandsData = debounce(loadLandsData, 500);

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

        mapbox.on("moveend", () => debouncedLoadLandsData(mapbox));
        mapbox.on("zoomend", () => debouncedLoadLandsData(mapbox));
      } catch (error) {
        console.error("Error in mapbox load event handler:", error);
      }
    });
  }
};