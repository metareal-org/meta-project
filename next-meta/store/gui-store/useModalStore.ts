import { create } from "zustand";

export type ModalNames = "noModal" | "confirmModal";

type ModalStates = {
  [key in ModalNames]: boolean;
};

interface ModalStore extends ModalStates {
  setModalState: (modal: ModalNames, active: boolean) => void;
}
const modals = {
  noModal: false,
  confirmModal: false,
};
const useModalStore = create<ModalStore>((set) => ({
  ...modals,
  setModalState: (modal, state) => {
    set({ ...modals, [modal]: state });
  },
}));

export default useModalStore;
