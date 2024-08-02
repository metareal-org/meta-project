// components/minigames/spinwheel/_spinwheel.tsx
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import useSpinwheelStore from "@/store/minigame-store/useSpinwheelStore";
import { Component } from "@/components/ui/tags";
import useAlertStore from "@/store/gui-store/useAlertStore";
import { X } from "lucide-react";
import useMissionStore from "@/store/useMissionStore";
import { MissionId } from "@/core/missions/mission-config";
import { useAssetStore } from "@/store/player-store/useAssetStore";
import { useUserStore } from "@/store/player-store/useUserStore";
import { useQuestStore } from "@/store/useQuestStore";

const constants = {
  wheel: {
    baseSpinDegree: 180,
    additionalSpin: 324.5,
    spinMultiplier: 0,
  },
  animation: {
    wheelDuration: 1,
    indicatorDuration: 0.1,
    indicatorRepeat: 0,
    indicatorRotation: -10,
  },
  alertDelay: 1,
};

export default function SpinWheel() {
  const [spinning, setSpinning] = useState(false);
  const { showSpinModal, setShowSpinModal } = useSpinwheelStore();
  const { openAlert } = useAlertStore();
  const { setSelectedMission } = useMissionStore();
  const { user } = useUserStore();
  const wheelRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    setIndicatorTransformOrigin();
  }, []);

  const setIndicatorTransformOrigin = () => {
    gsap.set(indicatorRef.current, {
      transformOrigin: "50% 50%",
    });
  };

  const spinWheel = () => {
    if (!spinning && user.assets.find((asset) => asset.type === "ticket")?.amount > 0) {
      setSpinning(true);

      const newSpinDegree = constants.wheel.baseSpinDegree + constants.wheel.additionalSpin * constants.wheel.spinMultiplier;
      animateWheel(newSpinDegree);
      animateIndicator();
    }
  };

  const animateWheel = (newSpinDegree: number) => {
    gsap.to(wheelRef.current, {
      duration: constants.animation.wheelDuration,
      rotation: newSpinDegree,
      onComplete: () => {
        setSpinning(false);
      },
    });
  };

  const animateIndicator = () => {
    gsap.to(indicatorRef.current, {
      duration: constants.animation.indicatorDuration,
      rotation: constants.animation.indicatorRotation,
      repeat: constants.animation.indicatorRepeat,
      onComplete: () => {
        gsap.set(indicatorRef.current, {
          rotation: 0,
        });
        showAlertAfterSpin();
      },
    });
  };

  const showAlertAfterSpin = () => {
    setTimeout(() => {
      openAlert({
        title: "Congratulations!",
        description: "You won a gift box!",
        picture: "/assets/images/minigames/spinwheel/giftbox.jpg",
        buttons: [
          {
            label: "Claim",
            onClick: handleGiftClaimed,
          },
        ],
      });
    }, constants.alertDelay);
  };

  const handleGiftClaimed = () => {
    useQuestStore
      .getState()
      .compeleteQuest(2)
      .then(() => {
        setShowSpinModal(false);
        setSelectedMission(MissionId.OpenGiftBox);
      });
  };

  const handleClose = () => {
    setShowSpinModal(false);
  };

  if (!showSpinModal || !user) return null;

  return (
    <>
      <Component className="fixed w-screen h-dvh bg-black/80 flex items-center justify-center z-10" onClick={handleClose}>
        <div
          style={{ background: "linear-gradient(90deg, #00B8FF 0%, #0459EC 100%)" }}
          className="rounded-3xl w-full max-w-3xl h-max py-16 fixed z-10 inset-0 m-auto "
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={handleClose} className="absolute bg-black-1000/30 p-1 rounded-full top-4 right-4 text-white hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>

          <section className="pl-40 flex flex-col items-center justify-center">
            <div className="relative">
              <img
                ref={wheelRef}
                className={`wheel size-80 ${spinning ? "spinning" : ""}`}
                src="\assets\images\minigames\spinwheel\board.png"
                alt="Spin Wheel"
              />
              <img
                ref={indicatorRef}
                className={`indicator absolute top-0 right-10 w-8 h-16 ${spinning ? "spinning" : ""}`}
                src="\assets\images\minigames\spinwheel\indicator.svg"
                alt="Indicator"
              />
            </div>
            <img className={"absolute w-64 left-12 bottom-0"} src="\assets\images\minigames\spinwheel\mr.png" alt="Spin Wheel" />
            <button
              className={`mt-4 scale-110 transition-all hover:scale-125 px-10 py-2 border-2 border-[#3020a6] bg-[#5e30d4] text-white rounded hover:bg-blue-600 ${
                spinning && "opacity-90 disabled pointer-events-none"
              } ${user.assets.find((asset) => asset.type === "ticket")?.amount <= 0 && "disabled pointer-events-none opacity-80"}`}
              onClick={spinWheel}
              disabled={spinning}
            >
              {spinning ? "Spinning..." : user.assets.find((asset) => asset.type === "ticket")?.amount > 0 ? "Spin Wheel" : "not enough ticket"}
            </button>
          </section>
          <div className="absolute px-2 py-1 text-sm bottom-5 right-5 bg-black-950 rounded text-white">
            Your tickets : {user.assets.find((asset) => asset.type === "ticket")?.amount}
          </div>
        </div>
      </Component>
    </>
  );
}
