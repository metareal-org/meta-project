import { useEffect, useMemo, useState } from "react";
import { useUserStore } from "@/store/player-store/useUserStore";
import numeral from "numeral";
import { HandCoins, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useAlertStore from "@/store/gui-store/useAlertStore";
import PortfolioWidgetWithdrawAlert from "./portfolio-widgect_withdraw_alert";

interface TokenDisplayProps {
  icon: string;
  amount: number;
  name: string;
  showLocked: boolean;
  freeAmount: number;
  lockedAmount: number;
  totalAmount: number;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ icon, amount, name, showLocked, freeAmount, lockedAmount, totalAmount }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="bg-teal-fg/90 border-2 relative border-teal rounded-full px-3 py-1 flex flex-col items-center justify-center cursor-pointer">
        <div className="flex items-center space-x-2">
          <img src={icon} alt={name} className="w-6 h-6" />
          <span className="text-white font-medium text-sm">
            {numeral(amount).format("0,0")} {name}
          </span>
        </div>
        <span className="text-xs absolute -top-4 bg-teal/90 left-[16px] rounded-b-none rounded px-2 text-teal-fg text-teal-200">
          {showLocked ? "Locked" : "Free"}
        </span>
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="bg-teal-fg text-white p-3 rounded-lg shadow-lg">
      <div className="space-y-1">
        <p className="font-semibold">{name} Details:</p>
        <p>Free: {numeral(freeAmount).format("0,0")}</p>
        <p>Locked: {numeral(lockedAmount).format("0,0")}</p>
        <p>Total: {numeral(totalAmount).format("0,0")}</p>
      </div>
    </TooltipContent>
  </Tooltip>
);

interface ToggleIndicatorProps {
  showLocked: boolean;
  setShowLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleIndicator: React.FC<ToggleIndicatorProps> = ({ showLocked, setShowLocked }) => (
  <Button
    size="icon"
    variant="ghost"
    onClick={() => setShowLocked(!showLocked)}
    className={`!p-1.5 border-2 border-teal bg-teal-fg/90 !rounded-full text-xs font-medium transition-colors
      ${showLocked ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
  >
    {showLocked ? <PiggyBank /> : <HandCoins />}
  </Button>
);



const PortfolioWidget: React.FC = () => {
  const [showLocked, setShowLocked] = useState(false);
  const { user } = useUserStore();
  const { openAlert } = useAlertStore();
  const [metaAmount, setMetaAmount] = useState({ free: 0, locked: 0, total: 0 });
  const [cpAmount, setCpAmount] = useState({ free: 0, locked: 0, total: 0 });

  useEffect(() => {
    if (!user || !user.assets) {
      console.log("User or user assets not available", user);
      return;
    }

    const metaAsset = user.assets.find((asset) => asset.type === "meta");
    const metaLockedAsset = user.assets.find((asset) => asset.type === "meta_locked");
    const cpAsset = user.assets.find((asset) => asset.type === "cp");
    const cpLockedAsset = user.assets.find((asset) => asset.type === "cp_locked");

    const newMetaAmount = {
      free: metaAsset ? metaAsset.amount : 0,
      locked: metaLockedAsset ? metaLockedAsset.amount : 0,
      total: (metaAsset ? metaAsset.amount : 0) + (metaLockedAsset ? metaLockedAsset.amount : 0),
    };

    const newCpAmount = {
      free: cpAsset ? cpAsset.amount : 0,
      locked: cpLockedAsset ? cpLockedAsset.amount : 0,
      total: (cpAsset ? cpAsset.amount : 0) + (cpLockedAsset ? cpLockedAsset.amount : 0),
    };

    setMetaAmount(newMetaAmount);
    setCpAmount(newCpAmount);

  }, [user]);

  const handleWithdraw = (amount: string) => {
    console.log("Withdrawal successful", amount);
    useAlertStore.getState().closeAlert("metaWithdraw");
  };

  const showWithdrawAlert = () => {
    if (!user) return;
    openAlert({
      picture: "/assets/images/tokens/withdraw_alert.jpg",
      closable: true,
      id: "metaWithdraw",
      title: "Withdraw Meta",
      description: <PortfolioWidgetWithdrawAlert user={user} metaAmount={metaAmount} onWithdraw={handleWithdraw} />,
      buttons: [
        { label: "Cancel", variant: "outline" },
        { label: "Withdraw", variant: "default" },
      ],
    });
  };

  return (
    <div className="fixed top-[42px] right-4 z-50">
      <TooltipProvider delayDuration={100}>
        <div className="flex items-center gap-2">
          <div onClick={showWithdrawAlert}>
            <TokenDisplay
              icon="/assets/images/tokens/meta.png"
              amount={showLocked ? metaAmount.locked : metaAmount.free}
              name="Meta"
              showLocked={showLocked}
              freeAmount={metaAmount.free}
              lockedAmount={metaAmount.locked}
              totalAmount={metaAmount.total}
            />
          </div>
          <TokenDisplay
            icon="/assets/images/tokens/cp.webp"
            amount={showLocked ? cpAmount.locked : cpAmount.free}
            name="CP"
            showLocked={showLocked}
            freeAmount={cpAmount.free}
            lockedAmount={cpAmount.locked}
            totalAmount={cpAmount.total}
          />
          <ToggleIndicator showLocked={showLocked} setShowLocked={setShowLocked} />
        </div>
      </TooltipProvider>
    </div>
  );
};

export default PortfolioWidget;
