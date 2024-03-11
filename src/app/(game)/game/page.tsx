import React from "react";
import NotesSection from "./_components/notes-section";
import GraphSection from "./_components/graph-section";
import WaveSection from "./_components/wave-section";
import VolumeSection from "./_components/volumen-section";
import NotePlayer from "./_components/note-player";

const Page = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(15rem,100%),1fr))] p-2 gap-2 ">
      <NotesSection />
      <GraphSection />
      <WaveSection />
      <VolumeSection />
      <NotePlayer />
    </div>
  );
};

export default Page;
