export interface IGame {
    id: number;
    name: string;
    imageUrl: string;
    studio: { id: number, name: string };
    gameType: string;
    gameTags: { id: number }[];
}