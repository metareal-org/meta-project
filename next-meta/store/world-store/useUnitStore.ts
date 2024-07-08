import { create } from "zustand";
import mapboxgl from "mapbox-gl";
import { DEFAULT_UNIT_COORDINATE } from "@/core/constants";
import useAvatarStore from "../objects-store/useAvatarStore";

const defaultCoordinates = DEFAULT_UNIT_COORDINATE;

type UnitStoreState = {
  unitCoordinates: [number, number];
  setUnitCoordinates: (coordinates: [number, number]) => void;
  createMarkerElement: () => HTMLElement;
  updateMarkerSize: (marker: mapboxgl.Marker, zoom: number) => void;
  moveMarker: (marker: mapboxgl.Marker, newCoordinates: [number, number]) => void;
  marker: mapboxgl.Marker | null;
  map: mapboxgl.Map | null;
  setMarker: (marker: mapboxgl.Marker, map: mapboxgl.Map) => void;
  isMarkerVisible: boolean;
  setMarkerVisibility: (visible: boolean) => void;
};

const useUnitStore = create<UnitStoreState>((set) => ({
  marker: null,
  map: null,
  setMarker: (marker, map) => set({ marker, map }),
  unitCoordinates: defaultCoordinates,
  setUnitCoordinates: (coordinates) => set({ unitCoordinates: coordinates }),
  createMarkerElement: () => {
    const markerElement = document.createElement("div");
    markerElement.className = "custom-marker";
    const avatarStore = useAvatarStore.getState();
    markerElement.style.backgroundImage = `url(https://cdn3d.iconscout.com/3d/premium/thumb/location-9170934-7475540.png?f=webp)`;
    markerElement.style.backgroundSize = "cover";
    return markerElement;
  },
  updateMarkerSize: (marker: mapboxgl.Marker, zoom: number) => {
    const initialSize = 0.2;
    const size = initialSize * Math.pow(2, zoom - 10);
    marker.getElement().style.width = `${size}px`;
    marker.getElement().style.height = `${size}px`;
  },
  moveMarker: (marker, newCoordinates) => {
    marker.setLngLat(newCoordinates);
    set({ unitCoordinates: newCoordinates });
  },
  isMarkerVisible: true,
  setMarkerVisibility: (visible: boolean) => {
    set((state) => {
      const { marker, map, isMarkerVisible } = state;
      if (marker && map) {
        if (visible && !isMarkerVisible) {
          marker.addTo(map);
        } else if (!visible && isMarkerVisible) {
          marker.remove();
        }
      }
      return { isMarkerVisible: visible };
    });
  },
}));

export default useUnitStore;
