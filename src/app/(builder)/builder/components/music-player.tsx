import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import useAudio, { ReturnUseAudio } from "@/hooks/useAudio";
import useIsMounted from "@/hooks/useIsMounted";
import useBuilderStore from "@/lib/store/zustand/useBuillderStore";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Ref, RefObject, useEffect, useRef } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { useShallow } from "zustand/react/shallow";

const MusicPlayer = ({ audioState }: { audioState: ReturnUseAudio }) => {
  const audioRef = audioState.audioRef;
  const play = audioState.play;

  const { playerState, song, setCurrentTime, setMetaData, setPlayerState } =
    useBuilderStore(
      useShallow((state) => ({
        song: state.music,
        playerState: state.playerState,
        setCurrentTime: state.setCurrentTime,
        setMetaData: state.setMetaData,
        setPlayerState: state.setPlayerState,
      })),
    );

  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (song === null) {
      return;
    }

    if (audioRef.current && song.src !== audioRef.current.src) {
      audioRef.current.src = song.src;
    }

    return () => {
      if (audioRef.current && song.src !== audioRef.current.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, [song, isMounted]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }
    console.log("Event listeners added\n\n\n\n\n\n\n");

    function loadMetaData(evt: HTMLMediaElementEventMap["loadeddata"]) {
      const target = evt.target as HTMLAudioElement;

      setMetaData({
        duration: target.duration,
        name: song?.file.name || "",
      });
    }

    function timeupdate(this: HTMLAudioElement) {
      setCurrentTime(this.currentTime);
    }

    audioRef.current?.addEventListener("loadeddata", loadMetaData);

    audioRef.current?.addEventListener("timeupdate", timeupdate);

    return () => {
      audioRef.current?.removeEventListener("loadeddata", loadMetaData);
      audioRef.current?.removeEventListener("timeupdate", timeupdate);
    };
  }, [isMounted]);

  const formatTime = (time: number) => {
    return `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(Math.floor(time % 60)).padStart(2, "0")}`;
  };

  const totalTime = song?.duration ? song?.duration : 0;
  const totalTimeParsed = formatTime(totalTime);
  const currentTimeParsed = formatTime(
    playerState?.currentTime ? playerState?.currentTime : 0,
  );

  const onChangeSlider = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]!;
    }
  };

  return (
    <div className="grid w-full items-center gap-4 pt-5">
      <audio ref={audioRef} />
      {song !== null ? (
        <>
          <div className="flex items-center gap-4">
            <div className="w-10 text-sm text-gray-500 dark:text-gray-400">
              {currentTimeParsed}
            </div>
            <Slider
              className="w-full flex-1"
              max={totalTime}
              min={0}
              step={0.1}
              onValueChange={onChangeSlider}
              value={[playerState?.currentTime || 0]}
            >
              <div>
                <div />
              </div>
              <div />
            </Slider>
            <div className="w-10 text-sm text-gray-500 dark:text-gray-400">
              {totalTimeParsed}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              className=" rounded-full"
              size={"icon"}
              variant={"secondary"}
            >
              <GoChevronLeft />
            </Button>
            <Button className=" rounded-full" size={"icon"} onClick={play}>
              {!playerState?.play ? <PlayIcon /> : <PauseIcon />}
            </Button>
            <Button
              className=" rounded-full"
              size={"icon"}
              variant={"secondary"}
            >
              <GoChevronRight />
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default MusicPlayer;
