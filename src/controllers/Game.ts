import { IGame } from './../models/Game';
import { IStudio } from './../models/Studio';

export class GameController {

    static itemPerPage = 20;

    static gamesFromStudio(gameIds: number[], stadio: IStudio): IGame[] {
        let currentGames: IGame[] = [];

        for (let gameId of gameIds) {
            const gameIndex = stadio.games.findIndex((game: IGame) => game.id === gameId);
            if (gameIndex >= 0) {
                currentGames.push(stadio.games[gameIndex]);
            }
        }
        return currentGames
    }

    static getPageCount = (length: number) => {
        let n: number = length / GameController.itemPerPage;
        let i = n | 0;
        let f = n - i;
        return Math.max(i + (f > 0 ? 1 : 0), 1);
    }

}
