import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { useState } from "react";

export default function MineDrawer() {
  const [tokenAmount, setTokenAmount] = useState("");
  const [stakingDuration, setStakingDuration] = useState("");

  return (
    <Card className="fixed z-50 inset-x-0 bottom-0 mx-auto p-0 w-full max-w-sm bg-background shadow-lg rounded-t-2xl">
      <CardHeader className="relative">
        <CardTitle className="pb-4">Staking mine</CardTitle>
        <Button variant="ghost" className="absolute text-white bg-black-950 top-[68px] right-9 !p-2 size-8" onClick={() => setDrawerState("buildingDrawer", false)}>
          <X size={24} />
        </Button>
        <img src="/assets/images/mine/mine.jpg" className="w-full h-[260px] object-cover rounded-xl" alt="Mine" />
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tokenAmount">Token Amount</Label>
            <Input id="tokenAmount" type="number" placeholder="Enter token amount" value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stakingDuration">Staking Duration</Label>
            <Select value={stakingDuration} onValueChange={setStakingDuration}>
              <SelectTrigger id="stakingDuration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Month</SelectItem>
                <SelectItem value="3">3 Months</SelectItem>
                <SelectItem value="6">6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <CardTitle>Rewards</CardTitle>
          <div className="flex gap-4">
            <RewardCard imageSrc="/assets/images/tokens/meta.png" name="Meta" apr="10% APR" />
            <RewardCard imageSrc="/assets/images/tokens/wood.png" name="Wood" apr="30% APD" />
          </div>
        </div>

        <Button className="w-full">Stake Tokens</Button>
      </CardContent>
    </Card>
  );
}

function RewardCard({ imageSrc, name, apr }: any) {
  return (
    <Card className="flex-1">
      <CardContent className="p-4 text-center">
        <img src={imageSrc} alt={name} className="w-12 h-12 mx-auto mb-2" />
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{apr}</p>
      </CardContent>
    </Card>
  );
}
