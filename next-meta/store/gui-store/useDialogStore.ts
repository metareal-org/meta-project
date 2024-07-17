import { create } from "zustand";

export interface DialogStore {
  buildingOfferListDialog: boolean;
  buildingOfferDialog: boolean;
  buildingSellDialog: boolean;
  buildingBuyDialog: boolean;
  buildingUpdateSellDialog: boolean;
  buildingAuctionBidDialog: boolean;
  buildingAuctionDialog: boolean;
  setDialogState: (dialog: keyof Omit<DialogStore, "setDialogState">, active: boolean) => void;
}

const useDialogStore = create<DialogStore>((set) => ({
  buildingOfferListDialog: false,
  buildingSellDialog: false,
  buildingBuyDialog: false,
  buildingOfferDialog: false,
  buildingUpdateSellDialog: false,
  buildingAuctionDialog: false,
  buildingAuctionBidDialog: false,
  setDialogState: (dialog, active) => {
    set((state) => {
      const newState: DialogStore = {
        ...state,
        [dialog]: active,
      };
      return newState;
    });
  },
}));

export default useDialogStore;
