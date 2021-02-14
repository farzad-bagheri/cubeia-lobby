import { IGame } from './Game';

export interface IStudio {
    id: number;
    name: string;
    imageUrl: string;
    blockedCurrencies: string | null;
    lobbyOrder: number;
    games: IGame[];
}