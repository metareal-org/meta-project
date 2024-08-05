import create from 'zustand';

interface AssetTradeStore {
  selectedTradeId: number | null;
  setSelectedTradeId: (id: number | null) => void;
}

const useAssetTradeStore = create<AssetTradeStore>((set) => ({
  selectedTradeId: null,
  setSelectedTradeId: (id) => set({ selectedTradeId: id }),
}));

export default useAssetTradeStore;