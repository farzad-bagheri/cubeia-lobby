import * as define from '../common/define';
import { filterGameList, IGame } from '../models/Game';
import { filterStudioList, IStudio } from '../models/Studio';

interface IAction {
    type: string;
    [key: string]: any;
}

export interface IAppState {
    /**
     * Rendering for small screens?
     */
    isMobile: boolean;

    /**
     * Currently selected currency, default is EUR
     */
    currency: string;

    /**
     * Currently selecetd category ID, can be -1 for favourites
     */
    categoryId: number;

    /**
     * Currently selecetd studio ID
     */
    studioId: number;

    /**
     * An array of studio IDs specified by the current category
     */
    studioIds: number[];

    /**
     * An array of game IDs specified by the current category or its tags
     */
    gameIds: number[];

    /**
     * An array of studios specified by the current category and filtered by currency
     */
    studios: IStudio[];

    /**
     * An array of games that are filtered by the current studio 
     */
    games: IGame[];
}

let initialState: IAppState = {
    isMobile: true,
    currency: 'EUR',
    categoryId: -1,
    studioId: -1,
    studioIds: [],
    studios: [],
    gameIds: [],
    games: [],
};

const reducer = (Oldstate: IAppState = initialState, action: IAction) => {
    let newState = { ...Oldstate };
    switch (action.type) {
        case define.Command.SetIsMobile:
            {
                newState.isMobile = action.isMobile;
                break;
            }
        case define.Command.SetCurrency:
            {
                //set currency
                newState.currency = action.currency;
                //get a list of studios which are filtered by the currency
                newState.studios = [...filterStudioList(Oldstate.studioIds, action.currency)];
                //get a list of games that are members of the current studio
                newState.games = [...filterGameList(Oldstate.gameIds, newState.studios, Oldstate.studioId)];
                break;
            }
        case define.Command.SetCategory:
            {
                //set category ID
                newState.categoryId = action.categoryId;
                //set the list of studio IDs that come with the current category
                newState.studioIds = [...action.studioIds];
                //set the list of game IDs that come with the current category
                newState.gameIds = [...action.gameIds];
                //get a list of studios which are filtered by the currency
                newState.studios = [...filterStudioList(action.studioIds, Oldstate.currency)];
                if (newState.studios.length > 0) {
                    //use the first studio of the category as the default studio
                    newState.studioId = newState.studios[0].id;
                    //get a list of games that are members of the current studio
                    newState.games = [...filterGameList(action.gameIds, newState.studios, newState.studioId)];
                }
                else {
                    //no game matched the filter
                    newState.games = [];
                }
                break;
            }
        case define.Command.SetFavourites:
            {
                //use a negative ID to indicate a special category (favourites) 
                newState.categoryId = -1;
                break;
            }
        case define.Command.SetStudio:
            {
                //set new studio ID
                newState.studioId = action.studioId;
                //get a list of games that are members of the current studio
                newState.games = [...filterGameList(Oldstate.gameIds, Oldstate.studios, newState.studioId)];
                break;
            }
        default:
            break;
    }
    return newState;
}

export default reducer;