import { IGame } from '../models/Game';

export class FavouriteGamesController {

    games: IGame[] = [];

    load() {
        const favourites = localStorage.getItem('favourites');
        if (favourites) {
            this.games = JSON.parse(favourites);
        }
    }

    isFavorite(gameId: number): boolean {
        return this.games.findIndex((game: IGame) => game.id === gameId) >= 0;
    }

    toggleGame(game: IGame): boolean {

        const index = this.games.findIndex((favouriteGame: IGame) => favouriteGame.id === game.id);
        if (index >= 0) {
            this.games = this.games.filter((favouriteGame: IGame) => favouriteGame.id !== game.id);
        }
        else {
            this.games.push(game);
        }
        localStorage.setItem('favourites', JSON.stringify(this.games));
        return index < 0;
    }

}