import { Game } from '@/lib/game';
import { GameContext } from '@/lib/game-context';
import { Song } from '@/lib/song';
import React, { useContext } from 'react'

const useGame = () => {
    const gameState = useContext(GameContext);

    if (!gameState) throw new Error("No game found");

    return gameState
}

export default useGame