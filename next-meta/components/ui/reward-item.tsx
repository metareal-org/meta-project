import React from 'react';
import { Grid } from "./tags";

interface RewardItemProps {
  imageSrc: string;
  name: string;
  apr: string;
}

const RewardItem: React.FC<RewardItemProps> = ({ imageSrc, name, apr }) => (
  <Grid className={`items-center border-2 rounded bg-${name.toLowerCase()}/10 border-${name.toLowerCase()}/60 p-2`}>
    <div className={`size-16 rounded border-2 border-${name.toLowerCase()}/60 bg-black p-2`}>
      <img src={imageSrc} alt={name} />
    </div>
    <div className="text-center text-sm mt-1 font-semibold">{name}</div>
    <div className="text-center text-xs">{apr}</div>
  </Grid>
);

export default RewardItem;