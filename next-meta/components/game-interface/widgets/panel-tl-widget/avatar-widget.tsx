import { Flex } from "@/components/ui/tags";
import { Fragment } from "react";
import useAvatarStore from "@/store/objects-store/useAvatarStore";
import { useUserStore } from "@/store/player-store/useUserStore";
export default function AvatarWidget() {
  return (
    <Fragment>
      <Avatar />
    </Fragment>
  );
}
const Avatar = () => {
  const { nickname } = useUserStore();
  console.log(nickname);
  const { avatarUrl } = useAvatarStore();

  if (!nickname || !avatarUrl) return null;

  const formattedAvatarUrl = avatarUrl.replace(".glb", ".png").split("?")[0] + "?size=600";

  return (
    <>
      <div id="avatar" className="fixed h-20 items-center flex top-3 left-5 z-40">
        <Flex className="items-center mt-2 relative">
          <img src="/assets/images/avatar/mine.png" className="z-[4]" />
          <div className="size-[90px] overflow-hidden left-[6px] top-[-12px] absolute">
            <img src={formattedAvatarUrl} className="absolute z-[5] size-[280px] object-cover left-0 top-[-10px] " />
          </div>
          <div className="bg-teal-fg/90 rounded-r-full -mt-1 text-sm flex items-center justify-center pl-4 pr-5 min-w-20 border-2 border-teal -ml-[14px] h-9">
            {nickname}
          </div>
        </Flex>
      </div>
    </>
  );
};
