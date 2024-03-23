import React, { ReactNode } from "react";
import GameProvider from "../_providers/game-provider";

const GameLayout = ({ children }: { children: ReactNode }) => {
  return (
    <GameProvider>
      <div className="relative min-h-screen overflow-hidden ">{children}</div>
    </GameProvider>
  );
};

export default GameLayout;
