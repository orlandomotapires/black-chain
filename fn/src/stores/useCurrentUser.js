import create from "zustand";

const useCurrentUser = create((set) => ({
	player: null, // Inicialmente definido como null
	setPlayer: (player) => set(player), // Função para definir todas as informações do jogador
	clearPlayer: () => set({ player: null }), // Limpar todas as informações do jogador
	getPlayer: () => set((state) => state.player), // Função para obter todas as informações do jogador
}));

export default useCurrentUser;
