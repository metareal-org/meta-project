import MissionCollectGems from "@/core/missions/collect-gems/mission-collect-gems";
import MissionDriveToChestman from "@/core/missions/drive-to-chestman/mission-driver-to-chestman";
import MissionGetYourAirdrops from "@/core/missions/get-your-airdrops/mission-get-your-airdrops";
import MissionAuthentication from "@/core/missions/authentication/mission-authentication";
import MissionCreateAvatar from "@/core/missions/create-avatar/mission-create-avatar";
import MissionAdvanture from "@/core/missions/advanture/mission-advanture";
import MissionInitialize from "@/core/missions/initialize/mission-initialize";
import MissionSetNickname from "@/core/missions/set-nickname/mission-set-nickname";
import MissionOpenGiftbox from "@/core/missions/open-giftbox/mission-open-giftbox";
export default function Missions() {
  MissionInitialize();
  MissionAuthentication();
  MissionCreateAvatar();
  MissionCollectGems();
  MissionDriveToChestman();
  MissionGetYourAirdrops();
  MissionAdvanture();
  MissionSetNickname();
  MissionOpenGiftbox();
}
