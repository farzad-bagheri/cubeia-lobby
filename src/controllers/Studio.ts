import { IStudio } from './../models/Studio';

export class StudioController {

    static getStudios(studioIds: number[], currency: string): IStudio[] {
        if (!window.lobbyData) {
            return [];
        }

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
}