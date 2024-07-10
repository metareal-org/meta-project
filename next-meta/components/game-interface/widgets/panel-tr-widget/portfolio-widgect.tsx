import { useState } from "react";
import { useUserStore } from "@/store/player-store/useUserStore";
import numeral from "numeral";
import { HandCoins, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TokenDisplayProps {
  icon: string;
  amount: number;
  name: string;
  showLocked: boolean;
  freeAmount: number;
  lockedAmount: number;
  totalAmount: number;
}

interface ToggleIndicatorProps {
  showLocked: boolean;
  setShowLocked: (value: boolean) => void;
}

const PortfolioWidget: React.FC = () => {
  const [showLocked, setShowLocked] = useState<boolean>(false);
  const { metaAmount, cpAmount } = useUserStore();

  return (
    <div className="fixed top-[42px] right-4 z-50">
      <TooltipProvider delayDuration={100}>
        <div className="flex items-center gap-2">
          <TokenDisplay 
            icon="/assets/images/tokens/meta.png" 
            amount={showLocked ? metaAmount.locked : metaAmount.free} 
            name="Meta" 
            showLocked={showLocked}
            freeAmount={metaAmount.free}
            lockedAmount={metaAmount.locked}
            totalAmount={metaAmount.total}
          />
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

const ToggleIndicator: React.FC<ToggleIndicatorProps> = ({ showLocked, setShowLocked }) => (
  <Button
    size={"icon"}
    variant={"ghost"}
    onClick={() => setShowLocked(!showLocked)}
    className={`!p-1.5 border-2 border-teal bg-teal-fg/90 !rounded-full text-xs font-medium transition-colors
      ${showLocked ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
  >
    {showLocked ?  <PiggyBank /> :<HandCoins />}
  </Button>
);

export default PortfolioWidget;