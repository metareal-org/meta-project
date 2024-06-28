import { useEffect, useRef, useCallback } from "react";
import useCarStore from "@/store/objects-store/useCarStore";
import useMapStore from "@/store/engine-store/useMapStore";
import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "@/core/missions/mission-config";
import * as THREE from "three";
import gsap from "gsap";
import { Marker } from "mapbox-gl";

const useCarLogic = () => {
  const { mapbox, minimap } = useMapStore();
  const { carModel, setWorldTranslate, setQuaternion } = useCarStore();
  const { selectedMission } = useMissionStore();

  const keys = useRef({
    a: false,
    s: false,
    d: false,
    w: false,
    k: false,
    shift: false,
  });

  const handleKey = useCallback((e: KeyboardEvent, isDown: boolean) => {
    const key = e.code.replace("Key", "").toLowerCase();
    if (key in keys.current) {
      keys.current[key as keyof typeof keys.current] = isDown;
    } else if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
      keys.current.shift = isDown;
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKey(e, true);
    const handleKeyUp = (e: KeyboardEvent) => handleKey(e, false);

    document.body.addEventListener("keydown", handleKeyDown);
    document.body.addEventListener("keyup", handleKeyUp);

    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
      document.body.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKey]);

  useEffect(() => {
    if (!carModel || !mapbox) return;

    const api = { acceleration: 1, inertia: 0.01 };
    let velocity = 0.0;
    let ds = 0.005;

    const toDeg = (rad: number): number => (rad / Math.PI) * 180;
    const toRad = (deg: number): number => (deg * Math.PI) / 180;

    carModel.set({
      worldTranslate: new THREE.Vector3(0, 0, 0),
      quaternion: [new THREE.Vector3(0, 0, 1), -0.67],
    });

    const inertia = api.inertia;
    const acceleration = api.acceleration;

    let carMarker: Marker | null = null;

    if (minimap) {
      const arrowElement = document.createElement("img");
      arrowElement.src = "/assets/markers/character.png";
      arrowElement.style.width = "18px";
      arrowElement.style.height = "20px";
      carMarker = new Marker({ element: arrowElement }).setLngLat(carModel.coordinates).addTo(minimap);
    }

    const tickerCallback = () => {
      if (selectedMission?.id !== MissionId.DriveToChestman) return;

      ds = keys.current.shift ? 0.02 : 0.005;
      let speed = 0.0;

      if (!keys.current.w && !keys.current.s) {
        if (Math.abs(velocity) < 0.0008) {
          velocity = 0.0;
        } else {
          speed = velocity > 0 ? -inertia * ds : inertia * ds;
        }
      } else {
        speed = keys.current.w ? acceleration * ds : -acceleration * ds;
      }

      velocity += (speed - velocity) * acceleration * ds;
      if (speed === 0.0) velocity = 0;

      const newWorldTranslate = new THREE.Vector3(0, -velocity, 0);
      setWorldTranslate(newWorldTranslate);
      carModel.set({ worldTranslate: newWorldTranslate });

      const rotationDirection = keys.current.a ? 1 : keys.current.d ? -1 : 0;
      const rotationSpeed = keys.current.k ? 1.5 : 0.75;
      const rad = rotationSpeed * rotationDirection * toRad(1);

      if (keys.current.a || keys.current.d) {
        const newQuaternion: [THREE.Vector3, number] = [new THREE.Vector3(0, 0, 1), carModel.rotation.z + rad];
        setQuaternion(newQuaternion);
        carModel.set({ quaternion: newQuaternion });
      }

      const bearing = keys.current.a || keys.current.d ? -toDeg(carModel.rotation.z) : mapbox.getBearing();

      mapbox.jumpTo({
        center: carModel.coordinates,
        bearing,
        pitch: 80,
        zoom: 30,
      });

      if (minimap && carMarker) {
        minimap.jumpTo({
          center: carModel.coordinates,
          bearing: -toDeg(carModel.rotation.z),
        });
        carMarker.setLngLat(carModel.coordinates);
      }
    };

    if (selectedMission?.id === MissionId.DriveToChestman) {
      gsap.ticker.add(tickerCallback);
    } else {
      gsap.ticker.remove(tickerCallback);
    }

    return () => {
      gsap.ticker.remove(tickerCallback);
      if (carMarker) {
        carMarker.remove();
      }
    };
  }, [carModel, mapbox, minimap, selectedMission, setWorldTranslate, setQuaternion]);

  return null;
};

export default useCarLogic;
