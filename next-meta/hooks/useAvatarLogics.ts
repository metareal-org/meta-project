import { useEffect, useMemo, useRef, useCallback } from "react";
import useAvatarStore from "@/store/objects-store/useAvatarStore";
import useMapStore from "@/store/engine-store/useMapStore";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import * as THREE from "three";
import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "@/core/missions/mission-config";

const glftAnimations = {
  gltfStand: null as GLTF | null,
  gltfWalk: null as GLTF | null,
  gltfRun: null as GLTF | null,
};

const useAvatarLogic = () => {
  const { mapbox } = useMapStore.getState();
  const { avatarModel } = useAvatarStore.getState();
  const { selectedMission } = useMissionStore.getState();

  const keys = useRef({
    a: false,
    s: false,
    d: false,
    w: false,
    shift: false,
  });

  const handleKey = useCallback(
    (e: KeyboardEvent, isDown: boolean) => {
      const key = e.key.toLowerCase();
      const code = e.code.replace("Key", "").toLowerCase();

      if (key === "shift") {
        keys.current.shift = isDown;
      } else if (code in keys.current) {
        keys.current[code as keyof typeof keys.current] = isDown;
      }
    },
    []
  );

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => handleKey(e, true);
    const keyUpHandler = (e: KeyboardEvent) => handleKey(e, false);

    document.body.addEventListener("keydown", keyDownHandler);
    document.body.addEventListener("keyup", keyUpHandler);
    return () => {
      document.body.removeEventListener("keydown", keyDownHandler);
      document.body.removeEventListener("keyup", keyUpHandler);
    };
  }, [handleKey]);

  const clock = useMemo(() => new THREE.Clock(), []);
  const mixer = useMemo(() => new THREE.AnimationMixer(avatarModel), [avatarModel]);

  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const [gltfStand, gltfWalk, gltfRun] = await Promise.all([
          new GLTFLoader().loadAsync("/assets/animations/Standing.glb"),
          new GLTFLoader().loadAsync("/assets/animations/Walk.glb"),
          new GLTFLoader().loadAsync("/assets/animations/Run.glb"),
        ]);
        glftAnimations.gltfStand = gltfStand;
        glftAnimations.gltfWalk = gltfWalk;
        glftAnimations.gltfRun = gltfRun;
      } catch (error) {
        console.error("Error loading GLB animations:", error);
      }
    };
    loadAnimations();
  }, []);

  useEffect(() => {
    if (!avatarModel || !mapbox || !glftAnimations.gltfStand || !glftAnimations.gltfWalk || !glftAnimations.gltfRun) return;

    const api = { acceleration: 1, inertia: 0.01 };
    let ds = 0.005;

    const toDeg = (rad: number): number => (rad / Math.PI) * 180;
    const toRad = (deg: number): number => (deg * Math.PI) / 180;

    avatarModel.set({
      worldTranslate: new THREE.Vector3(0, 0, 0),
      quaternion: [new THREE.Vector3(0, 0, 1), toRad(270)],
    });

    let isKeySPressed = false;
    let hasRotated = false;

    avatarModel.animations.length = 0;
    avatarModel.animations.push(glftAnimations.gltfStand.animations[0], glftAnimations.gltfWalk.animations[0], glftAnimations.gltfRun.animations[0]);

    const tickerCallback = () => {
      if (selectedMission?.id !== MissionId.CollectGems) return;

      const playAnimation = (animation: THREE.AnimationClip | undefined) => {
        if (animation && !mixer.clipAction(animation).isRunning()) {
          Object.values(avatarModel.animations as Record<string, THREE.AnimationClip>).forEach((anim: THREE.AnimationClip) => {
            if (anim && anim !== animation) {
              mixer.clipAction(anim).stop();
            }
          });
          mixer.clipAction(animation).play();
        }
      };

      const animationToPlay =
        (keys.current.w || keys.current.s) && keys.current.shift
          ? avatarModel.animations[2]
          : keys.current.a || keys.current.s || keys.current.d || keys.current.w
          ? avatarModel.animations[1]
          : avatarModel.animations[0];

      playAnimation(animationToPlay);
      mixer.update(clock.getDelta());

      avatarModel.getObjectByName("Hips").position.set(0, avatarModel.getObjectByName("Hips").position.y, 0);

      ds = keys.current.shift ? 0.04 : 0.002;
      const speed = (keys.current.w || keys.current.s ? api.acceleration : 0) * ds;
      avatarModel.set({ worldTranslate: new THREE.Vector3(0, -speed, 0) });

      const rotationDirection = keys.current.d ? -1 : 1;
      const rad = toRad(1) * (keys.current.a || keys.current.d ? rotationDirection : 0);

      if (keys.current.a || keys.current.d) {
        avatarModel.set({ quaternion: [new THREE.Vector3(0, 0, 1), avatarModel.rotation.z + rad] });
      }

      if (keys.current.s && !isKeySPressed && !hasRotated) {
        hasRotated = true;
        avatarModel.set({ quaternion: [new THREE.Vector3(0, 0, 1), avatarModel.rotation.z + Math.PI] });
        isKeySPressed = true;
      } else if (!keys.current.s) {
        isKeySPressed = false;
      }

      if (!keys.current.w && !keys.current.s && !keys.current.a && !keys.current.d) return;

      const bearingCalculation =
        (keys.current.a && !keys.current.s) || (keys.current.d && !keys.current.s) || keys.current.w
          ? -toDeg(avatarModel.rotation.z)
          : hasRotated
          ? 180 - toDeg(avatarModel.rotation.z)
          : mapbox.getBearing();

      mapbox.jumpTo({
        pitch: 80,
        center: avatarModel.coordinates,
        bearing: bearingCalculation,
        zoom: 25,
      });
    };

    if (selectedMission?.id === MissionId.CollectGems) {
      gsap.ticker.add(tickerCallback);
    } else {
      gsap.ticker.remove(tickerCallback);
      mixer.stopAllAction();
      avatarModel.visible = false;
    }

    return () => {
      gsap.ticker.remove(tickerCallback);
    };
  }, [avatarModel, mapbox, clock, mixer, selectedMission]);

  return null;
};

export default useAvatarLogic;