import useMapStore from "@/store/engine-store/useMapStore";
import { useEffect } from "react";

export default function GetLocation() {
  const { mapbox } = useMapStore();

  useEffect(() => {
    if (mapbox) {
      mapbox.on("click", (event) => {
        const { lngLat } = event;
        console.log([`${lngLat.lng},${lngLat.lat}`]);
      });
    }
  }, [mapbox]);

  return null;
}
