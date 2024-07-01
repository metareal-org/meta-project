import useMissionStore from "@/store/useMissionStore";
import useFobStore from "@/store/objects-store/useFobStore";
import { useEffect } from "react";
import { MissionId } from "@/core/missions/mission-config";
import useMapStore from "@/store/engine-store/useMapStore";
import useThreeboxStore, { ThreeboxStore } from "@/store/engine-store/useThreeboxStore";
import { CHESTMAN_LOCATION } from "@/core/constants";
import axios from "axios";
import mapboxgl, { Marker } from "mapbox-gl";
import useCarStore from "@/store/objects-store/useCarStore";
import useChestmanStore from "@/store/objects-store/useChestmanStore";
import loadCar from "@/core/loaders/models-load/car-load";
import useCarLogic from "@/hooks/useCarLogic";
import loadChestman from "@/core/loaders/models-load/chestman-load";
import axiosInstance from "@/lib/axios-instance";
import useGemStore from "@/store/objects-store/useGemsStore";
import useAlertStore from "@/store/gui-store/useAlertStore";
import { Grid } from "@/components/ui/tags";
import { Button } from "@/components/ui/button";
const DEBUG = false;
const addRoute = async (minimap: mapboxgl.Map | undefined, carModel: { coordinates: number[] } | undefined) => {
  if (!minimap || !carModel) return;
  const fromLocation = carModel.coordinates;
  const toLocation = CHESTMAN_LOCATION;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLocation[0]},${fromLocation[1]};${toLocation[0]},${toLocation[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
  try {
    const response = await axios.get(url);
    const route = response.data.routes[0].geometry;
    ["route", "route-arrows"].forEach((layer) => {
      if (minimap.getLayer(layer)) minimap.removeLayer(layer);
      if (minimap.getSource(layer)) minimap.removeSource(layer);
    });
    minimap.loadImage("/assets/markers/arrow.png", (_, image) => {
      if (!minimap.hasImage("arrow")) minimap.addImage("arrow", image as HTMLImageElement | ImageBitmap);
      ["route", "route-arrows"].forEach((layer, i) =>
        minimap.addSource(layer, {
          type: "geojson",
          data: { type: "Feature", geometry: route, properties: {} },
        })
      );
      minimap.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: { "line-color": "#3887be", "line-width": 5, "line-opacity": 0.75 },
      });
      minimap.addLayer({
        id: "route-arrows",
        type: "symbol",
        source: "route-arrows",
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": 100,
          "icon-image": "arrow",
          "icon-size": 0.4,
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
        },
      });
    });
  } catch (error) {
    console.error("Error fetching route:", error);
  }
};

export default function MissionDriverToChestman() {
  const { selectedMission, setSelectedMission } = useMissionStore();
  const { minimap, mapbox } = useMapStore();
  const { threebox } = useThreeboxStore() as ThreeboxStore;
  const { carModel, isCarLoaded } = useCarStore();
  const { isChestmanNearby } = useChestmanStore();
  const { isReachedToChestman, checkNearbyChestman, setIsReachedToChestman } = useChestmanStore();
  const { areGemsLoaded, setAllGemsVisibility, gemModels } = useGemStore.getState();
  const { openAlert } = useAlertStore();
  useEffect(() => {
    loadChestman();

    if (selectedMission.id !== MissionId.DriveToChestman) return;
    if (!isCarLoaded) {
      loadCar();
      DEBUG && console.log("Car loaded");
    } else {

      openAlert({
        title: "Time to drive!",
        description: (
          <>
            <Grid>
              <div>Look at minimap it will show you where you need to drive.</div>
              <div className="flex flex-wrap gap-2 items-center py-2 rounded-lg">
                <div>you can use</div>
                <div className="gap-1 flex flex-wrap w-max">
                  <Button variant={"outline"} size={"iconsm"}>
                    W
                  </Button>
                  <Button variant={"outline"} size={"iconsm"}>
                    A
                  </Button>
                  <Button variant={"outline"} size={"iconsm"}>
                    S
                  </Button>
                  <Button variant={"outline"} size={"iconsm"}>
                    D
                  </Button>
                </div>
                <div>to move and</div>
                <Button variant={"outline"} className="h-7 ">
                  Shift
                </Button>
                <div>to look boost your speed</div>
              </div>
            </Grid>
          </>
        ),
        picture: "/assets/images/missions/drive-to-chestman/man-looking-at-map.jfif",
        buttons: [{ label: "ok!" }],
      });
    }
  }, [selectedMission, isCarLoaded]);

  useEffect(() => {
    if (selectedMission.id === MissionId.DriveToChestman && areGemsLoaded && gemModels.length > 0) {
      console.log("Setting all gems visibility to false");
      setAllGemsVisibility(false);
    }
  }, [selectedMission.id, areGemsLoaded, gemModels.length, setAllGemsVisibility, threebox]);

  useEffect(() => {
    if (selectedMission.id === MissionId.DriveToChestman) {
      axiosInstance.post("user/update", { current_mission: MissionId.DriveToChestman }).then((response) => {
        DEBUG && console.log(response);
      });
    }
  }, [selectedMission]);
  useCarLogic();

  useEffect(() => {
    if (!carModel || !threebox || isReachedToChestman || selectedMission.id !== MissionId.DriveToChestman) return;
    const handleObjectChanged = () => {
      checkNearbyChestman(carModel.coordinates);
    };
    carModel.addEventListener("ObjectChanged", handleObjectChanged);
    return () => {
      setIsReachedToChestman(true);
      carModel.visible = false;
      carModel.removeEventListener("ObjectChanged", handleObjectChanged);
    };
  }, [carModel, selectedMission, threebox]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null;
    if (selectedMission?.id === MissionId.DriveToChestman && minimap && threebox && carModel) {
      const updateRoute = () => addRoute(minimap, carModel);
      updateRoute();
      const gemElement = document.createElement("img");
      gemElement.src = "/assets/markers/gem.png";
      gemElement.style.width = "22px";
      gemElement.style.height = "22px";
      new Marker({ element: gemElement }).setLngLat(CHESTMAN_LOCATION).addTo(minimap);
      intervalId = setInterval(updateRoute, 5000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [selectedMission, minimap, threebox, carModel]);
  useEffect(() => {
    if (selectedMission?.id === MissionId.DriveToChestman) {
      if (isChestmanNearby) {
        setSelectedMission(MissionId.GetYourAirdrops);
      }
    }
  }, [selectedMission, isChestmanNearby, setSelectedMission]);

  return null;
}
