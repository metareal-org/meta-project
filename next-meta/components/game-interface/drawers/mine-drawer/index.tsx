import useDrawerStore from "@/store/gui-store/useDrawerStore";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useLandStore from "@/store/world-store/useLandStore";
import { Flex } from "@/components/ui/tags";
import RewardItem from "@/components/ui/reward-item";

const MetaTokenStaking = () => {
  const [tokenAmount, setTokenAmount] = useState("");
  const [stakingDuration, setStakingDuration] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Token Amount:", tokenAmount);
  };
  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">Staking Pool</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="tokenAmount" className="font-bold mb-2">
            Token Amount
          </Label>
          <Input
            id="tokenAmount"
            type="number"
            placeholder="Enter token amount"
            required
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="stakingDuration" className="font-bold mb-2">
            Staking Duration
          </Label>
          <Select value={stakingDuration} onValueChange={setStakingDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Month</SelectItem>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Rewards</h2>
          <Flex className="gap-2">
            <RewardItem imageSrc="/assets/images/tokens/meta.png" name="Meta" apr="10% APR" />
            <RewardItem imageSrc="/assets/images/tokens/wood.png" name="Wood" apr="30% APD" />
          </Flex>
        </div>
        <Button type="submit" className="text-white font-bold py-2 px-4 rounded">
          Stake Tokens
        </Button>
      </form>
    </div>
  );
};
export default function MineDrawer() {
  const { mineDrawer } = useDrawerStore();
  const { selectedLand } = useLandStore();
  if (!mineDrawer || !selectedLand) return null;
  return (
    <div className="fixed inset-y-0 z-10 bg-black h-max right-10 my-auto w-full max-w-sm shadow-lg rounded-t-lg p-4">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-semibold tracking-tight text-primary">Wood Jungle</h3>
        <p className="mt-1 text-sm">Size: 1201</p>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <MetaTokenStaking />
      </div>
    </div>
  );
}
