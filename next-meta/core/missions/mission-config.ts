// core/missions/mission-config.ts

export enum MissionId {
  Initialize = 0,
  Authentication = 1,
  SetNickname = 2,
  CreateAvatar = 3,
  CollectGems = 4,
  DriveToChestman = 5,
  GetYourAirdrops = 6,
  OpenGiftBox = 7,
  Advanture = 8,
}

export interface MissionConfig {
  id: MissionId;
  label: String;
  components: {
    mapbox?: boolean;
    minimap?: boolean;
    avatar_creator?: boolean;
    widgets?: boolean;
    drawers?: boolean;
    dialogs?: boolean;
    alerts?: boolean;
  };
}

const defaultComponents = {
  mapbox: true,
  minimap: false,
  avatar_creator: false,
  widgets: true,
  drawers: true,
  dialogs: true,
  alerts: true,
};

export const missionConfigs: MissionConfig[] = [
  {
    id: MissionId.Initialize,
    label: "Initialize",
    components: {
      ...defaultComponents,
      widgets: false,
      drawers: false,
    },
  },
  {
    id: MissionId.SetNickname,
    label: "Set Nikname",
    components: defaultComponents,
  },
  {
    id: MissionId.Authentication,
    label: "Authentication",
    components: {
      ...defaultComponents,
      widgets: false,
      drawers: false,
    },
  },
  {
    id: MissionId.CreateAvatar,
    label: "Create Avatar",
    components: {
      ...defaultComponents,
      avatar_creator: true,
      widgets: false,
      drawers: false,
      dialogs: false,
      alerts: false,
    },
  },
  {
    id: MissionId.CollectGems,
    label: "Collect Gems",
    components: {
      ...defaultComponents,
      drawers: false,
    },
  },
  {
    id: MissionId.DriveToChestman,
    label: "Drive to Chestman",
    components: {
      ...defaultComponents,
      minimap: true,
    },
  },
  {
    id: MissionId.GetYourAirdrops,
    label: "Get Your Airdrops",
    components: defaultComponents,
  },
  {
    id: MissionId.OpenGiftBox,
    label: "Open Your giftbox",
    components: defaultComponents,
  },
  {
    id: MissionId.Advanture,
    label: "Advanture",
    components: defaultComponents,
  },
];
