import { Game } from '@/lib/game';
import { NotePlayer, Song } from '@/lib/song';
import React, { use, useCallback, useState } from 'react'

const useCreateGame = () => {

    const [song, setSong] = useState<Song | null>(null);

    const [currentNote, setCurrentNote] = useState<NotePlayer | null>(null);

    const playSong = useCallback(() => {
        if (!song) return;
        song.notes.map((note) => {

            setTimeout(() => {

                setCurrentNote(note)
            }, note.duration * 1000)

        })
    }, [song])

    const loadSong = useCallback((newSong: Song) => {
        setSong(newSong)
    }, [])

    return { loadSong, song, playSong, currentNote }

}

export default useCreateGame