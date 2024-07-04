import { useState, useEffect } from "react";
import { Flex, Grid } from "@/components/ui/tags";
import useAvatarStore, { DEFAULT_AVATAR } from "@/store/objects-store/useAvatarStore";
import { useUserStore } from "@/store/player-store/useUserStore";
import axios from "axios";
import { ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import { useDisconnect } from "wagmi";

const Avatar = () => {
  const { nickname } = useUserStore();
  const { avatarUrl } = useAvatarStore();
  const { disconnect } = useDisconnect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [outfitGender, setOutfitGender] = useState(null);

  useEffect(() => {
    if (avatarUrl && avatarUrl != DEFAULT_AVATAR) {
      axios
        .get(`${avatarUrl.replace(".glb", "").split("?")[0]}.json`)
        .then((response) => setOutfitGender(response.data.outfitGender))
        .catch((error) => console.error("Error fetching outfit gender:", error));
    }
  }, [avatarUrl]);

  if (!nickname || !avatarUrl) return null;

  const formattedAvatarUrl = avatarUrl.replace(".glb", ".png").split("?")[0] + "?size=600";

  const avatarImageStyle =
    outfitGender === "feminine" ? "absolute z-[5] size-[230px] object-cover left-0 top-[-30px]" : "absolute z-[5] size-[280px] object-cover left-0 top-[-10px]";

  const ProfileMenu = () => {
    const handleLogout = () => {
      Cookies.remove("token");
      disconnect();
      window.location.reload();
    };
    return (
      <>
        <div className="bg-teal-fg/90 rounded-xl -mt-1 text-sm flex flex-col items-center justify-center  min-w-20 border-2 border-teal ml-2 h-9">
          <div className="cursor-pointer w-full text-center py-1 " onClick={handleLogout}>
            Logout
          </div>
        </div>
      </>
    );
  };
  return (
    <div id="avatar" className="fixed  items-center flex top-3 left-5 z-40">
      <Grid>
        <Flex className="items-center mt-2 relative">
          <img src="/assets/images/avatar/mine.png" className="z-[4]" />
          <div className="size-[90px] overflow-hidden left-[6px] top-[-12px] absolute">
            <img src={formattedAvatarUrl} className={avatarImageStyle} />
          </div>
          <div className="bg-teal-fg/90 rounded-r-full -mt-1 text-sm flex items-center justify-center pl-4 pr-5 min-w-20 border-2 border-teal -ml-[14px] h-9">
            {nickname}
          </div>
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-teal-fg/90 cursor-pointer rounded-full -mt-1 text-sm flex items-center p-0 justify-cente  size-9 border-2 border-teal ml-[6px]"
          >
            <div className="pr-[0.5px] pt-[3px] mx-auto w-max">
              <ChevronDown strokeWidth={0} fill="white" />
            </div>
          </div>
        </Flex>
        {isMenuOpen && <ProfileMenu />}
      </Grid>
    </div>
  );
};

export default Avatar;
