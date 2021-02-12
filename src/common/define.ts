export const APP_NAME = 'Cubeia';

export enum Command {
    SetIsMobile = 'SET_IS_MOBILE',
    SetCurrency = 'SetCurrency',
    SetCategory = 'SetCategory',
    SetFavourites = 'SetFavourites',
    SetStudio = 'SetStudio',
}

export enum PagePath {
    Lobby = '/'
}

export enum PageId {
    Error = 0,
    Lobby = 1
}

export const PageTitles = [
    { title: 'Error' },
    { title: 'Lobby' }
];

export const colorPrimary = { main: '#ff5722', light: '#f79b7f', dark: '#df4314' };
export const colorSecondary = { main: '#f50258' };