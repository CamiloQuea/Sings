import React from "react";
import NotePlayer from "./_components/note-player";
import SoundDebugger from "./_components/sound-debuger";

const Page = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(15rem,100%),1fr))] p-2 gap-2 ">
      <NotePlayer />
      <SoundDebugger />
    </div>
  );
};

export default Page;
