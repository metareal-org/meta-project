import Mapbox from "@/components/game-engine/mapbox";
import AvatarCreatorContainer from "../game-interface/screens/avatar-creator";
import useMissionStore from "@/store/useMissionStore";

export default function GameEngine() {
  const selectedMission = useMissionStore((state) => state.selectedMission);
  if (!selectedMission) {
    return null;
  }
  const { components } = selectedMission;

  return (
    <>
      {components.avatar_creator && <AvatarCreatorContainer />}
      {components.mapbox && <Mapbox />}
    </>
  );
}
