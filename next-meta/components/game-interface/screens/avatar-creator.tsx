import { MissionId } from "@/core/missions/mission-config";
import useAvatarStore from "@/store/objects-store/useAvatarStore";
import useMissionStore from "@/store/useMissionStore";
import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from "@readyplayerme/react-avatar-creator";

const config: AvatarCreatorConfig = {
  clearCache: true,
  bodyType: "fullbody",
  quickStart: true,
  language: "en",
};

const style = { width: "100%", height: "100vh", border: "none" };
export default function AvatarCreatorContainer() {
  const { setAvatarUrl } = useAvatarStore();
  const { setSelectedMission } = useMissionStore();
  const handleOnAvatarExported = (event: AvatarExportedEvent) => {
    console.log(`Avatar URL is: ${event.data.url + "?quality=low&meshLod=0"}`);
    setAvatarUrl(event.data.url + "?quality=low&meshLod=0");
  };
  return (
    <>
      <AvatarCreator subdomain="demo" config={config} style={style} onAvatarExported={handleOnAvatarExported} />
    </>
  );
}
