"use client";

import Dropzone from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useBuilderStore from "@/lib/store/zustand/useBuillderStore";
import { GoSearch } from "react-icons/go";
import { useShallow } from "zustand/react/shallow";
import LyricsConfigurationTab from "./components/lyrics-configuration-tab";
import MusicPlayer from "./components/music-player";
import useAudio from "@/hooks/useAudio";

export default function Dashboard() {
  const { song, loadSong, setMetadata } = useBuilderStore(
    useShallow((state) => ({
      song: state.music,
      loadSong: state.setSong,
      setMetadata: state.setMetaData,
    })),
  );

  const audioPlayer = useAudio();

  return song !== null ? (
    <>
      <section className="border-b bg-muted px-10 pb-5 pt-7">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-primary"></div>
          <div className="flex flex-1 flex-col">
            <Input
              className="border-0 text-2xl font-semibold"
              placeholder="Click here to change the title..."
              value={song.name}
              onChange={(e) => {
                console.log(
                  "The concatenated lyrics do not match the textarea value",
                  {
                    duration: song.duration,
                    name: e.target.value,
                  },
                );
                setMetadata({
                  duration: song.duration,
                  name: e.target.value,
                });
              }}
            />

            <p className="pl-3 text-sm text-muted-foreground">
              You can edit more details in the "Information" tab bellow
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => {
              //TODO Save files to use as karaoke
              console.log("Files saved!");
            }}
          >
            Save
          </Button>
        </div>
        <MusicPlayer audioState={audioPlayer} />
      </section>

      <Tabs
        defaultValue={DEFAULT_TAB?.value}
        className="shrink-1 flex flex-1 flex-col  overflow-y-scroll"
      >
        <div className=" sticky top-0 bg-background px-4 py-2">
          <TabsList className="">
            {TabConfiguration.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {TabConfiguration.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-0 flex-1 flex-col p-5"
          >
            <tab.content audioState={audioPlayer} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  ) : (
    <>
      <Dropzone
        onDrop={(acceptedFiles) => {
          if (acceptedFiles.length > 0) {
            loadSong(acceptedFiles[0]!);
          }
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="relative m-10 flex  border-spacing-3 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-4 border-dotted p-2"
          >
            <input {...getInputProps()} />

            <GoSearch className="text-3xl" />
            <p className="text-muted-foreground">
              Start dropping your audio file here, or click to search and select
              it yourself.
            </p>
          </div>
        )}
      </Dropzone>
    </>
  );
}

const createTab = ({
  title,
  content,
}: {
  title: string;
  content: (audio: { audioState: ReturnType<typeof useAudio> }) => JSX.Element;
}) => {
  return {
    title,
    content,
    value: title.toLowerCase(),
  };
};

const TabConfiguration: ReturnType<typeof createTab>[] = [
  createTab({
    title: "Lyrics",
    content: LyricsConfigurationTab,
  }),
  createTab({
    title: "Notes",
    content: () => <>Notes Configuration</>,
  }),
  createTab({
    title: "Information",
    content: () => <>Information Configuration</>,
  }),
];

const DEFAULT_TAB = TabConfiguration[0];
