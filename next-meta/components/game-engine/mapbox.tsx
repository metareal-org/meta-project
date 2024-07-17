"use client";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useMapStore from "@/store/engine-store/useMapStore";
import { setupClickInteractions } from "@/core/interactions/click-intractions";
import useThreeboxStore, { ThreeboxStore } from "@/store/engine-store/useThreeboxStore";
import { Threebox } from "threebox-plugin";
import loadMarkers from "@/core/loaders/markers-load/_index";
import { AZADI_TOWER_COORDINATES, DEBUG, UNIT_COORDINATES } from "@/core/constants";
import useMissionStore from "@/store/useMissionStore";
import * as THREE from "three";
import { GeoJsonLoader } from "@/core/loaders/utils/geojson-loader";
import { useUserStore } from "@/store/player-store/useUserStore";

export default function Mapbox() {
  const [isClient, setIsClient] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const minimapContainer = useRef<HTMLDivElement>(null);
  const { mapbox, minimap, initializeMapbox, initializeMinimap } = useMapStore();
  const { threebox, setThreebox } = useThreeboxStore() as ThreeboxStore;
  const { selectedMission } = useMissionStore();
  const { user } = useUserStore();
  const [rtlLoaded, setRtlLoaded] = useState(false);
  mapboxgl.accessToken = "pk.eyJ1Ijoic3ViZGFuaWFsIiwiYSI6ImNsNTU3cmcwdjE2cm0zZnFxdm1pemZ3cjQifQ.fLqs4EX703SYVVE0DzknNw";
  useEffect(() => {
    if (isClient) return;
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || rtlLoaded) return;
    mapboxgl.setRTLTextPlugin(
      "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
      () => {
        setRtlLoaded(true);
      },
      true
    );
  }, [isClient, rtlLoaded]);

  useEffect(() => {
    if (!mapbox && mapContainer.current) {
      initializeMapbox({
        container: mapContainer.current,
        center: UNIT_COORDINATES,
        zoom: 0,
      });
    }
  }, [mapbox, initializeMapbox]);

  useEffect(() => {
    if (!minimap && minimapContainer.current) {
      initializeMinimap({
        container: minimapContainer.current,
        center: AZADI_TOWER_COORDINATES,
        zoom: 16,
      });
    }
  }, [minimap, initializeMinimap]);

  useEffect(() => {
    if (mapbox && !threebox) {
      const tb = new Threebox(mapbox, mapbox.getCanvas().getContext("webgl"), {
        defaultLights: false,
        multiLayer: true,
      });

      const setupLighting = () => {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        tb.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        tb.add(directionalLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
        tb.add(hemisphereLight);
      };

      setupLighting();

      window.tb = tb;
      mapbox.on("style.load", () => {
        mapbox.setFog({
          range: [14, 14],
          "horizon-blend": 0.1,
          color: "#070f14",
          "high-color": "#070f14",
          "space-color": "#070f14",
          "star-intensity": 0.8,
        });
      });
      setThreebox(tb);
    }
  }, [mapbox, threebox, setThreebox]);

  useEffect(() => {
    setupClickInteractions();
    if (!mapbox) return;
    GeoJsonLoader("citylands", "citylands");
    loadMarkers();
  }, [mapbox, selectedMission]);

  return (
    <div className="relative w-full h-screen">
      {selectedMission.components.mapbox && (
        <div className="absolute inset-0 w-full h-full">
          <div ref={mapContainer} className="w-full h-full"></div>
        </div>
      )}
      <div className={!selectedMission.components.minimap ? "opacity-0" : ""}>
        <div className="absolute bottom-5 right-5 w-40 h-40 border border-gray-300 rounded-md overflow-hidden z-10">
          <div ref={minimapContainer} className="w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}
