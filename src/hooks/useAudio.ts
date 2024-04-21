import useBuilderStore from "@/lib/store/zustand/useBuillderStore";
import React, { useRef } from "react";
import { useShallow } from "zustand/react/shallow";

const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const builderStore = useBuilderStore(
    useShallow((state) => ({
      playerState: state.playerState,
      SetPlayerState: state.setPlayerState,
    })),
  );

  const play = () => {
    if (!audioRef.current) {
      return;
    }

    if (audioRef.current.paused) {
      audioRef.current.play();
      builderStore.SetPlayerState({
        play: true,
        volume: audioRef.current.volume,
        currentTime: audioRef.current.currentTime,
      });
    } else {
      audioRef.current.pause();
      builderStore.SetPlayerState({
        play: false,
        volume: audioRef.current.volume,
        currentTime: audioRef.current.currentTime,
      });
    }
  };

  const changeCurrentTime = (time: number) => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.currentTime = time;
  };

  return {
    changeCurrentTime,
    play,
    audioRef,
  };
};

export type ReturnUseAudio = ReturnType<typeof useAudio>;

export default useAudio;
