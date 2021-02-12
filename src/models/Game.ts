import { IStudio } from './Studio';

export interface IGame {
    id: number;
    name: string;
    imageUrl: string;
    studio: { id: number, name: string };
    gameType: string;
    gameTags: { id: number }[];
}

/**
 * Creates an array of IGame from the given game IDs which are members of the current studio 
 * @param gameIds 
 * @param stadios 
 * @param studioId 
 */
export const filterGameList = (gameIds: number[], stadios: IStudio[], studioId: number): IGame[] => {
    const studioIndex = stadios.findIndex((studio: IStudio) => studio.id === studioId);
    if (studioIndex < 0)
        return [];

    let currentGames: IGame[] = [];

    for (let gameId of gameIds) {
        let studio = stadios[studioIndex];
        const gameIndex = studio.games.findIndex((game: IGame) => game.id === gameId);
        if (gameIndex >= 0) {
            currentGames.push(studio.games[gameIndex]);
        }
    }
    return currentGames
}

/**
 * Toggles the given game in the favourites list
 * @param game 
 */
export const toggleFavoriteGame = (game: IGame): boolean => {

    const index = window.lobbyData.favouriteGames.findIndex((favouriteGame: IGame) => favouriteGame.id === game.id);
    if (index >= 0) {
        window.lobbyData.favouriteGames = window.lobbyData.favouriteGames.filter((favouriteGame: IGame) => favouriteGame.id !== game.id);
    }
    else {
        window.lobbyData.favouriteGames.push(game);
    }
    localStorage.setItem('favourites', JSON.stringify(window.lobbyData.favouriteGames));
    return index < 0;
}

/**
 * Checks if the given game ID is in the favourites list
 * @param gameId 
 */
export const inFavorites = (gameId: number): boolean => {
    const favouriteGames = window.lobbyData.favouriteGames as IGame[];
    return favouriteGames.findIndex((game: IGame) => game.id === gameId) >= 0;
}