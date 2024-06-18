import create from "zustand";

const useCurrentUser = create((set) => ({
	playerId: null,
	setPlayerId: (id) => set({ playerId: id }),
	clearPlayerId: () => set({ playerId: null }),
}));

export default useCurrentUser;
