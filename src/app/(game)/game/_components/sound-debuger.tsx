"use client";

import React from "react";
import GraphSection from "./graph-section";
import NotesSection from "./notes-section";
import VolumeSection from "./volumen-section";
import WaveSection from "./wave-section";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MinusIcon, SectionIcon } from "@radix-ui/react-icons";
import useIsMounted from "@/hooks/useIsMounted";

const SoundDebugger = () => {
  // i want manage what section should be shown using a state an saving the state in local storage

  const [showSections, setShowSections] = React.useState({
    notes: true,
    graph: true,
    wave: true,
    volume: true,
  });

  const [minimized, setMinimized] = React.useState(true);

  const isMounted = useIsMounted();

  React.useEffect(() => {
    if (!isMounted) return;

    setMinimized(localStorage.getItem("debugger-min") === "true");

    setShowSections(JSON.parse(localStorage.getItem("showSections") || "{}"));
  }, [isMounted]);

  React.useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("showSections", JSON.stringify(showSections));
  }, [isMounted, showSections]);

  React.useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("debugger-min", JSON.stringify(minimized));
  }, [isMounted, minimized]);

  const handleToggleSection = (section: string) => {
    setShowSections((prevState) => ({
      ...prevState,
      [section]: !(prevState as any)[section as any],
    }));
  };

  // Retrieve showSections from local storage on component mount
  React.useEffect(() => {
    const storedSections = localStorage.getItem("showSections");
    if (storedSections) {
      setShowSections(JSON.parse(storedSections));
    }
  }, []);

  return (
    <div className="absolute  right-0 bottom-0 p-2 border bg-background m-2 min-w-60 rounded">
      <div className="flex items-center ">
        <h2 className="select-none">Debugger</h2>
        <button className="ml-auto">
          <MinusIcon
            onClick={() => {
              setMinimized(!minimized);
            }}
          />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-2">
            <SectionIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuLabel>Graphs</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showSections.notes}
              onCheckedChange={() => {
                handleToggleSection("notes");
              }}
            >
              Notes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showSections.graph}
              onClick={() => {
                handleToggleSection("graph");
              }}
            >
              Graph
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showSections.wave}
              onClick={() => {
                handleToggleSection("wave");
              }}
            >
              Wave
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showSections.volume}
              onClick={() => {
                handleToggleSection("volume");
              }}
            >
              Volume
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <hr className="my-2" />
      <div
        className="flex flex-col gap-2"
        style={{
          display: minimized ? "none" : "flex",
        }}
      >
        {showSections.notes && <NotesSection />}
        {showSections.graph && <GraphSection />}
        {showSections.wave && <WaveSection />}
        {showSections.volume && <VolumeSection />}
        
      </div>
    </div>
  );
};

export default SoundDebugger;
