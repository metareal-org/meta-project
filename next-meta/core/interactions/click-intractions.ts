import useMapStore from "@/store/engine-store/useMapStore";
import useLandStore from "@/store/world-store/useLandStore";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { center, area } from "@turf/turf";

export const setupClickInteractions = () => {
  const { setDrawerState } = useDrawerStore.getState();
  const { mapbox } = useMapStore.getState();
  if (!mapbox) return;

  mapbox.on("click", (e) => {
    const features = mapbox.queryRenderedFeatures(e.point, {
      layers: ["citylands"],
    });

    if (features.length > 0) {
      const feature = features[0];
      handleLandClick(feature, setDrawerState);
    } else {
      deselectLand();
    }
  });
};

const handleLandClick = (feature: MapboxGeoJSONFeature, setDrawerState: any) => {
  const { setSelectedLandId, selectedLandId } = useLandStore.getState();
  const { mapbox } = useMapStore.getState();
  const drawerLand: { [key: string]: string } = {
    citylands: "buildingDrawer",
  };

  const clickedLandId = feature.properties?.id;

  if (selectedLandId === clickedLandId) {
    deselectLand();
  } else {
    deselectLand();
    setSelectedLandId(clickedLandId);
    setDrawerState(drawerLand[feature.layer.id], true);

    const centerPoint = center({ type: "FeatureCollection", features: [feature] });
    const polygonArea = area({ type: "FeatureCollection", features: [feature] });
    const baseZoomLevel = 16;
    const areaThreshold = 1000000;
    const zoomLevel = polygonArea < areaThreshold ? baseZoomLevel + 2 : baseZoomLevel - Math.log2(polygonArea / areaThreshold);
    const [lng, lat] = centerPoint.geometry.coordinates;

    if (mapbox) {
      mapbox.flyTo({
        center: [lng, lat],
        zoom: zoomLevel,
        speed: 1,
      });
    }
  }
};

const deselectLand = () => {
  const { setSelectedLandId, selectedLandId } = useLandStore.getState();
  if (selectedLandId !== null) {
    const { mapbox } = useMapStore.getState();
    if (mapbox) {
      mapbox.setPaintProperty("citylands", "fill-color", ["case", ["has", "fill-color"], ["get", "fill-color"], "rgba(0, 0, 0, 0.1)"]);
    }
  }
  setSelectedLandId(null);
};