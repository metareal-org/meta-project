import useMapStore from "@/store/engine-store/useMapStore";
import useLandStore from "@/store/world-store/useLandStore";
import useDrawerStore from "@/store/gui-store/useDrawerStore";
import { MapboxGeoJSONFeature } from "mapbox-gl";
import { center, area } from "@turf/turf";

export const setupClickInteractions = () => {
  const { setDrawerState } = useDrawerStore.getState();
  const { mapbox } = useMapStore.getState();
  if (!mapbox) return;
  mapbox.on("click", "citylands", (e) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      handleLandClick(feature, setDrawerState);
    }
  });
  // mapbox.on("click", "mines", (e) => {
  //   if (e.features && e.features.length > 0) {
  //     const feature = e.features[0];
  //     handleLandClick(feature, setDrawerState);
  //   }
  // });
  mapbox.on("click", (e) => {
    const features = mapbox.queryRenderedFeatures(e.point, {
      layers: ["citylands"],
    });
    if (features.length === 0) {
      deselectLand();
    }
  });
};

const handleLandClick = (feature: MapboxGeoJSONFeature, setDrawerState: any) => {
  const { setSelectedLand, selectedLand } = useLandStore.getState();
  const { mapbox } = useMapStore.getState();
  const drawerLand: { [key: string]: string } = {
    citylands: "buildingDrawer",
    // mines: "mineDrawer",
  };

  if (selectedLand && selectedLand.properties?.id === feature.properties?.id) {
    deselectLand();
  } else {
    deselectLand();
    setSelectedLand(feature);
    updateFillColor(feature);
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
  const { setSelectedLand, selectedLand } = useLandStore.getState();
  if (selectedLand) {
    resetFillColor(selectedLand);
  }
  setSelectedLand(null);
};

const updateFillColor = (feature: MapboxGeoJSONFeature) => {
  const { mapbox } = useMapStore.getState();
  if (mapbox) {
    const layerId = feature.layer.id;
    mapbox.setPaintProperty(layerId, "fill-color", [
      "case",
      ["==", ["get", "id"], feature.properties?.id],
      "#83a66c",
      ["case", ["has", "fill-color"], ["get", "fill-color"], "rgba(0, 0, 0, 0.1)"],
    ]);
  }
};

const resetFillColor = (feature: MapboxGeoJSONFeature) => {
  const { mapbox } = useMapStore.getState();
  if (mapbox) {
    const layerId = feature.layer.id;
    mapbox.setPaintProperty(layerId, "fill-color", ["case", ["has", "fill-color"], ["get", "fill-color"], "rgba(0, 0, 0, 0.1)"]);
  }
};
