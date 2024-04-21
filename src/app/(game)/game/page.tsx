import React from "react";
import NotePlayer from "./_components/note-player";
import SoundDebugger from "./_components/sound-debuger";

const Page = () => {
  return (
    <div className="flex">
     
      <NotePlayer />
    
      <SoundDebugger />
    </div>
  );
};

export default Page;
