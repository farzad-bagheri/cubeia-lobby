export interface ICategory {
    id: number;
    name: string;
    lobbyOrder: number;
    games: number[];
    studios: number[];
    types: string[];
    tags: number[];
}