export type NotePlayer = {
    freq: number;
    duration: number;
    type: string;
};

export type Song = {
    title: string,
    description: string,
    notes: NotePlayer[]
};