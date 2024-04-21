import { Button } from "@/components/ui/button";
import { AnimatePresence, Variant, Variants, motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import useAudio from "@/hooks/useAudio";
import useBuilderStore from "@/lib/store/zustand/useBuillderStore";
import { cn } from "@/lib/utils";
import { DotIcon } from "@radix-ui/react-icons";
import next from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoPlusCircle, GoX } from "react-icons/go";
import { useShallow } from "zustand/react/shallow";

type LyricsMap = {
  time: number;
  lyrics: string;
};

const LyricsConfigurationTab = ({
  audioState,
}: {
  audioState: ReturnType<typeof useAudio>;
}) => {
  const [lyricsMapping, setLyricsMapping] = useState<LyricsMap[]>([]);

  const builderStore = useBuilderStore(
    useShallow((state) => ({
      playerState: state.playerState,
      setCurrentTime: state.setCurrentTime,
    })),
  );

  useEffect(() => {
    const concatenatedLyrics = lyricsMapping
      .map((lyric) => lyric.lyrics)
      .join(" ");
    const textareaValue = (document.getElementById("message") as any)?.value;
    if (concatenatedLyrics === textareaValue) {
      console.log("The concatenated lyrics match the textarea value");
    } else {
      console.log("The concatenated lyrics do not match the textarea value");
    }
  }, [lyricsMapping]);

  function insertInOrder(array: LyricsMap[], item: LyricsMap) {
    const index = array.findIndex((i) => i.time > item.time);
    const newArray = [...array];

    if (index === -1) {
      newArray.push(item);
    } else {
      newArray.splice(index, 0, item);
    }
    return newArray;
  }

  return (
    <div className="flex grow flex-col gap-4 overflow-y-auto px-2 md:px-7">
      <LyricsComponent lyricsMapping={lyricsMapping} />

      <div className="grid  grid-cols-1 gap-4 lg:grid-cols-3">
        <ScrollArea className="max-h-80 min-h-80 rounded-md border">
          <Button
            className="sticky top-0 flex w-full gap-2 rounded-none border-b bg-background px-4 py-2"
            variant="ghost"
            size="icon"
            onClick={() => {
              setLyricsMapping((current) => {
                return insertInOrder(current, {
                  lyrics: `Test ${current.length}`,
                  time: builderStore.playerState?.currentTime || 0,
                });
              });
            }}
          >
            <GoPlusCircle className="size-4" />
            <span>Add Lyrics</span>
          </Button>
          <div className="space-y-2 px-4 py-2">
            {lyricsMapping.map((lyric, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex flex-1 gap-2">
                  <Button
                    variant={"default"}
                    size={"icon"}
                    className="flex items-center justify-center"
                    onClick={() => {
                      audioState.changeCurrentTime(lyric.time);
                    }}
                  >
                    <DotIcon />
                  </Button>
                  <Input
                    className="text- rounded-none  font-semibold"
                    placeholder="Click here to change the title..."
                    value={lyric.lyrics}
                    onChange={(e) => {
                      const newLyricsMapping = [...lyricsMapping];
                      newLyricsMapping[index]!.lyrics = e.target.value;
                      setLyricsMapping(newLyricsMapping);
                    }}
                  />
                  <Input
                    className=" w-1/3 rounded-none  font-semibold"
                    placeholder="Click here to change the title..."
                    value={lyric.time}
                    onChange={(e) => {
                      const newLyricsMapping = [...lyricsMapping];
                      newLyricsMapping[index]!.time = Number(e.target.value);
                      setLyricsMapping(newLyricsMapping);
                    }}
                  />
                  {/* delete option */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setLyricsMapping(
                        lyricsMapping.filter((_, i) => i !== index),
                      );
                    }}
                  >
                    <GoX className="size-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Lyrics</CardTitle>
              <CardDescription>
                Add the lyrics of the song, to verify the mapping is correct and
                in orden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
                <Label htmlFor="message" className="sr-only">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  className="min-h-12 resize-none border-0  shadow-none focus-visible:ring-0"
                />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LyricsConfigurationTab;

function LyricsComponent({ lyricsMapping }: { lyricsMapping: LyricsMap[] }) {
  const [mainLyricIndex, setMainLyricndex] = useState(0);
  const [secLyricIndex, setSecLyricndex] = useState(1);

  const variant: Variants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      y: "-100%",
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const builderStore = useBuilderStore(
    useShallow((state) => ({
      playerState: state.playerState,
      setCurrentTime: state.setCurrentTime,
    })),
  );

  const isCurrentLyric = useCallback(
    (lyric: LyricsMap) => {
      const currentTime = builderStore.playerState?.currentTime;
      const currentLyricIndex = lyricsMapping.findIndex(
        (curr) => curr === lyric,
      );
      let isLyricViable = false;

      const nextLyric = lyricsMapping[currentLyricIndex + 1]?.time || Infinity;

      if (typeof currentTime === "undefined") {
        return isLyricViable;
      }

      if (currentTime >= lyric.time && currentTime < nextLyric) {
        isLyricViable = true;
      }
      return isLyricViable;
    },
    [builderStore.playerState?.currentTime, lyricsMapping],
  );

  useEffect(() => {
    const index = lyricsMapping.findIndex((curr) => isCurrentLyric(curr));
    console.log(index);
    setMainLyricndex(index);
    setSecLyricndex(index + 1);
  }, [builderStore.playerState?.currentTime, lyricsMapping]);

  // TODO Smooth Scroll into view only when it is active. Only 2 elements at a time. Dont shrink, fix size
  return (
    <div className="relative grid  min-h-20 grid-rows-2 items-center justify-center  overflow-hidden rounded border">
      {lyricsMapping.map((lyric, index) => (
        <AnimatePresence key={index} custom={index} mode="popLayout">
          {(mainLyricIndex === index || secLyricIndex === index) && (
            <motion.div
              layout="position"
              layoutId={`${index}-layout-key`}
              initial={{
                opacity: 0,
                y: "100%",
              }}
              animate="visible"
              exit="exit"
              variants={variant}
              className={cn(
                `flex items-center justify-center gap-4`,
                index === mainLyricIndex ? " text-xl font-extrabold " : "",
                index === secLyricIndex ? " text-lg font-light " : "",
              )}
            >
              <div className="flex flex-1 justify-center gap-2">
                <span className="flex  items-center whitespace-nowrap text-center">
                  {lyric.lyrics}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}
