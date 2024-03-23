import { createContext } from "react";
import { Game } from "./game";
import useCreateGame from "@/hooks/useCreateGame";

export const GameContext = createContext<ReturnType<typeof useCreateGame> | null>(null)