// components/game-interface/GameInterface.tsx
import React, { useEffect, useState } from "react";
import Dialogs from "@/components/game-interface/dialogs/_dialogs";
import Drawers from "@/components/game-interface/drawers/_drawers";
import Widgets from "@/components/game-interface/widgets";
import { useMissionStore } from "@/store/useMissionStore";
import Alert from "./alerts/_alert";
import LoadingScreen from "./screens/loading-screen";
import AuthScreen from "./screens/auth-screen";
import useMapStore from "@/store/engine-store/useMapStore";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import useJoyrideStore from "@/store/gui-store/useJoyrideStore";

export default function GameInterface() {
  const selectedMission = useMissionStore((state) => state.selectedMission);
  const { isFlying } = useMapStore();
  const { joyrideSteps, removeStep } = useJoyrideStore();
  const [runJoyride, setRunJoyride] = useState(false);

  useEffect(() => {
    if (joyrideSteps.length > 0) {
      setRunJoyride(true);
    }
  }, [joyrideSteps]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunJoyride(false);
    }
    if (status === STATUS.FINISHED && index === joyrideSteps.length - 1) {
      removeStep(joyrideSteps[index].target);
    }
  };

  if (!selectedMission) {
    return null;
  }

  const { components } = selectedMission;

  return (
    <>
      <Joyride
        run={runJoyride}
        steps={joyrideSteps}
        continuous={false}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      <LoadingScreen />
      <AuthScreen />
      {isFlying && <div className="fixed z-50 w-full h-full" />}
      {components.widgets && <Widgets />}
      {components.drawers && <Drawers />}
      {components.dialogs && <Dialogs />}
      {components.alerts && <Alert />}
    </>
  );
}
