import { IGame } from './Game';

export interface IStudio {
    id: number;
    name: string;
    imageUrl: string;
    blockedCurrencies: string | null;
    lobbyOrder: number;
    games: IGame[];
}

/**
 * Filters the given studio IDs with currency and returns a sorted array of IStudio
 * @param studioIds list to filter
 * @param currency current currency to check against
 */
export const filterStudioList = (studioIds: number[], currency: string): IStudio[] => {
    const currentStudios: IStudio[] = window.lobbyData.studios.filter((studio: IStudio) => {
        if (studio.blockedCurrencies && studio.blockedCurrencies.includes(currency)) {
            return false;
        }
        for (let id of studioIds) {
            if (id === studio.id) {
                return true;
            }
        }
        return false;
    });

    return currentStudios.sort((a: IStudio, b: IStudio) => b.lobbyOrder - a.lobbyOrder);
}