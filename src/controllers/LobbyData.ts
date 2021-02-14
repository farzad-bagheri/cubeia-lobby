import axios from 'axios';
import { ICategory } from '../models/Category';
import { ILobbyData } from '../models/LobbyData';
import { IStudio } from '../models/Studio';

export class LobbyDataController {

    lobbyData: ILobbyData | undefined = undefined;

    async load(): Promise<void> {
        const response = await axios.get(process.env.REACT_APP_SERVER_BASE_PATH + '/rest/casino/lobby');
        this.lobbyData = response.data;
    }

    optimize(): void {
        if (!this.lobbyData) {
            throw new Error('Data are not available to optimize.');
        }

        const studios: IStudio[] = this.lobbyData.studios;
        for (let i = 0; i < studios.length; i++) {
            studios[i].games = [];
        }
        
        this.lobbyData.categories = this.lobbyData.categories.sort((a: ICategory, b: ICategory) => b.lobbyOrder - a.lobbyOrder);
        let categories: ICategory[] = this.lobbyData.categories;

        for (let game of this.lobbyData.games) {

            //find the studio that matches game.studio.id
            const studioIndex = studios.findIndex((studio: IStudio) => studio.id === game.studio.id);
            if (studioIndex < 0) continue;
            //store this game with the studio
            studios[studioIndex].games.push(game);

            for (let category of categories) {
                //ignore the game if it is already in the list
                if (category.games.includes(game.id))
                    continue;
                //add if game category types include game type
                if (category.types.includes(game.gameType)) {
                    category.games.push(game.id);
                    continue;
                }
                //add if one of the game tags can be found in the category tags
                for (let gameTag of game.gameTags) {
                    if (category.tags.includes(gameTag.id)) {
                        category.games.push(game.id);
                    }
                }
            }
        }
    }

}