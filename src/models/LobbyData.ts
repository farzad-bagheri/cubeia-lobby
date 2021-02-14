import { IGame } from "./Game";
import { IStudio } from "./Studio";
import { ICategory } from "./Category";

export interface ILobbyData {
    games: IGame[];
    categories: ICategory[];
    studios: IStudio[];
}