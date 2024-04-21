import { create } from "zustand";

type MusicMetaData = {
  duration: number;
  name: string;
};

type Data = {
  music:
    | (MusicMetaData & {
        file: File;
        src: string;
      })
    | null;
  playerState: {
    play: boolean;
    volume: number;
    currentTime: number;
  } | null;
};

type Methods = Data & {
  setSong: (file: File) => void;
  setCurrentTime: (time: number) => void;
  setMetaData: (metaData: MusicMetaData) => void;
  setPlayerState: (playerState: Data["playerState"]) => void;
};

type Store = Data & Methods;

const defaultState: Data = {
  music: null,
  playerState: null,
};

const useBuilderStore = create<Store>(
  (set): Store => ({
    ...defaultState,
    setSong: (file) => {
      set(() => ({
        music: {
          file,
          src: URL.createObjectURL(file),
          duration: 0,
          name: file.name,
        },
        playerState: {
          play: false,
          volume: 0.3,
          currentTime: 0,
        },
      }));
    },
    setCurrentTime: (time) => {
      set((state) => ({
        ...state,
        playerState: {
          ...state.playerState!,
          currentTime: time,
        },
      }));
    },
    setMetaData: (metaData) => {
      set((state) => ({
        music: {
          ...state.music!,
          ...metaData,
        },
      }));
    },
    setPlayerState: (playerState) => {
      set((state) => ({
        ...state,
        playerState,
      }));
    },
  }),
);

export default useBuilderStore;
