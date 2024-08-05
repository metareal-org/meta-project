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
  theme: "default" | "shadcn";
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({ icon, amount, name, showLocked, freeAmount, lockedAmount, totalAmount, theme }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div
        className={`${
          theme === "default" ? "bg-teal-fg/90 border-2 border-teal rounded-full" : "bg-background border"
        } relative px-3 py-1 flex flex-col items-center justify-center cursor-pointer`}
      >
        {theme === "default" && (
          <span
            className="text-xs absolute -top-4 bg-teal/90 left-[16px] rounded-b-none rounded px-2 text-teal-fg text-teal-200"
          >
            {showLocked ? "Locked" : "Free"}
          </span>
        )}
        <div className="flex items-center space-x-2">
          {theme === "shadcn" && (
            <span className="text-xs text-muted-foreground mr-1">
              {showLocked ? "Locked" : "Free"}:
            </span>
          )}
          <img src={icon} alt={name} className="w-6 h-6" />
          <span className={`${theme === "default" ? "text-white" : "text-foreground"} font-medium text-sm`}>
            {numeral(amount).format("0,0")} {name}
          </span>
        </div>
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom" className={`${theme === "default" ? "bg-teal-fg  rounded-lg text-white" : "bg-teal-fg text-white rounded-none"} p-3 shadow-lg`}>
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
  theme: "default" | "shadcn";
}

const ToggleIndicator: React.FC<ToggleIndicatorProps> = ({ showLocked, setShowLocked, theme }) => (
  <Button
    size="icon"
    variant={theme === "default" ? "ghost" : "outline"}
    onClick={() => setShowLocked(!showLocked)}
    className={`${
      theme === "default"
        ? "!p-1.5 border-2 border-teal bg-teal-fg/90 !rounded-full text-xs font-medium transition-colors"
        : "rounded-none"
    } ${
      theme === "default"
        ? showLocked
          ? "bg-red-500 text-white"
          : "bg-green-500 text-white"
        : ""
    }`}
  >
    {showLocked ? <PiggyBank /> : <HandCoins />}
  </Button>
);

interface PortfolioWidgetProps {
  theme?: "default" | "shadcn";
}

const PortfolioWidget: React.FC<PortfolioWidgetProps> = ({ theme = "default" }) => {
  const [showLocked, setShowLocked] = useState(false);
  const { user, getAssetAmount } = useUserStore();
  const { openAlert } = useAlertStore();

  const getAmount = (type: string) => ({
    free: getAssetAmount(type),
    locked: getAssetAmount(`${type}_locked`),
    get total() {
      return this.free + this.locked;
    },
  });

  const metaAmount = getAmount("meta");
  const cpAmount = getAmount("cp");
  const bnbAmount = getAmount("bnb");

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
    <div className={` ${theme === "shadcn" ? "rounded-lg" : "fixed top-[42px] right-4 z-50"}`}>
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
              theme={theme}
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
            theme={theme}
          />
          <TokenDisplay
            icon="/assets/images/tokens/bnb.webp"
            amount={showLocked ? bnbAmount.locked : bnbAmount.free}
            name="BNB"
            showLocked={showLocked}
            freeAmount={bnbAmount.free}
            lockedAmount={bnbAmount.locked}
            totalAmount={bnbAmount.total}
            theme={theme}
          />
          <ToggleIndicator showLocked={showLocked} setShowLocked={setShowLocked} theme={theme} />
        </div>
      </TooltipProvider>
    </div>
  );
};

export default PortfolioWidget;
