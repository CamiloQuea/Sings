"use client";
import React, { ReactNode, createContext, useState } from "react";
import { Game } from "../../lib/game";
import { GameContext } from "@/lib/game-context";
import useCreateGame from "@/hooks/useCreateGame";

const GameProvider = ({ children }: { children: ReactNode }) => {
  const gameState = useCreateGame();

  return (
    <GameContext.Provider value={gameState}>{children}</GameContext.Provider>
  );
};

export default GameProvider;
