import { create } from "zustand";
import mapboxgl, { MapboxOptions } from "mapbox-gl";

interface MapStoreState {
  mapbox: mapboxgl.Map | null;
  minimap: mapboxgl.Map | null;
  isFlying: boolean;
  spinEnabled: boolean;
  spinInterval: NodeJS.Timeout | null;
}

interface MapStoreActions {
  initializeMapbox: (options: MapboxOptions) => void;
  initializeMinimap: (options: MapboxOptions) => void;
  setIsFlying: (flying: boolean) => void;
  startSpinGlobe: () => void;
  stopSpinGlobe: () => void;
  handleUserInteraction: () => void;
}

export const useMapStore = create<MapStoreState & MapStoreActions>((set, get) => ({
  mapbox: null,
  minimap: null,
  spinEnabled: true,
  spinInterval: null,
  isFlying: false,
  setIsFlying: (flying) => {
    set({ isFlying: flying });
  },
  initializeMapbox: (options: MapboxOptions) => {
    const map = new mapboxgl.Map({
      container: options.container,
      style: "mapbox://styles/subdanial/clmotdjxu01ys01pba6z08b3m",
      center: options.center,
      zoom: options.zoom,
    });
    set({ mapbox: map });
  },
  initializeMinimap: (options: MapboxOptions) => {
    const map = new mapboxgl.Map({
      container: options.container,
      style: "mapbox://styles/subdanial/clmotdjxu01ys01pba6z08b3m",
      center: options.center,
      zoom: options.zoom,
    });
    set({ minimap: map });
  },
  startSpinGlobe: () => {
    const { mapbox, spinEnabled } = get();
    if (mapbox && spinEnabled && mapbox.getZoom() < 5) {
      const secondsPerRevolution = 120;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let distancePerSecond = 360 / secondsPerRevolution;
      const zoom = mapbox.getZoom();
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = mapbox.getCenter();
      center.lng -= distancePerSecond;
      mapbox.easeTo({ center, duration: 1000, easing: (n) => n });
      const interval = setTimeout(get().startSpinGlobe, 1000);
      set({ spinInterval: interval });
    }
  },
  stopSpinGlobe: () => {
    const { spinInterval } = get();
    if (spinInterval) {
      clearTimeout(spinInterval);
      set({ spinInterval: null });
    }
  },
  handleUserInteraction: () => {
    get().stopSpinGlobe();
  },
}));

export default useMapStore;
