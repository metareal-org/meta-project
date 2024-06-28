// components/game-interface/GameInterface.tsx
import Dialogs from "@/components/game-interface/dialogs/_dialogs";
import Drawers from "@/components/game-interface/drawers/_drawers";
import Widgets from "@/components/game-interface/widgets";
import { useMissionStore } from "@/store/useMissionStore";
import Alert from "./alerts/_alert";
import LoadingScreen from "./screens/loading-screen";
import AuthScreen from "./screens/auth-screen";
import useMapStore from "@/store/engine-store/useMapStore";

export default function GameInterface() {
  const selectedMission = useMissionStore((state) => state.selectedMission);
  const { isFlying } = useMapStore();
  if (!selectedMission) {
    return null;
  }

  const { components } = selectedMission;

  return (
    <>
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
