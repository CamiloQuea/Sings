import React, { ReactNode } from "react";

const GameLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden ">{children}</div>
  );
};

export default GameLayout;
