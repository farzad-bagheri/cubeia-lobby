import { Typography } from '@material-ui/core';
import axios from 'axios';
import { Component } from 'react';
import { ICategory } from '../../models/Category';
import { IGame } from '../../models/Game';
import { IStudio } from '../../models/Studio';
import './LobbyData.css';

enum LobbyDataPhase {
    Initial = 1,
    Waiting = 2,
    Loaded = 3,
    Error = 4
}

declare global {
    interface Window {
        lobbyData: any | undefined;
    }
}
class LobbyData extends Component<{ onStatusChanged: (result: 'loaded' | 'error') => void }> {

    isAlive = false;

    state = { phase: LobbyDataPhase.Initial };

    handleLoadProfile = async () => {
        this.setState({ phase: LobbyDataPhase.Waiting });
        try {
            const response = await axios.get(process.env.REACT_APP_SERVER_BASE_PATH + '/rest/casino/lobby');
            if (this.isAlive) {
                window.lobbyData = response.data;

                const studios = window.lobbyData.studios as IStudio[];
                for (let i = 0; i < studios.length; i++) {
                    studios[i].games = [];
                }

                let categories = window.lobbyData.categories as ICategory[];
                for (let game of window.lobbyData.games as IGame[]) {
                    const studioIndex = studios.findIndex((studio: IStudio) => studio.id === game.studio.id);
                    if (studioIndex < 0) continue;
                    studios[studioIndex].games.push(game);

                    for (let category of categories) {

                        if (category.games.includes(game.id))
                            continue;

                        if (category.types.includes(game.gameType)) {
                            category.games.push(game.id);
                            continue;
                        }

                        for (let gameTag of game.gameTags) {
                            if (category.tags.includes(gameTag.id)) {
                                category.games.push(game.id);
                            }
                        }
                    }
                }

                let favouriteGames: IGame[] = [];
                const favourites = localStorage.getItem('favourites');
                if (favourites) {
                    favouriteGames = JSON.parse(favourites);
                }
                window.lobbyData.favouriteGames = favouriteGames;

                this.props.onStatusChanged('loaded');
            }
        }
        catch (e) {
            if (this.isAlive) {
                this.setState({ phase: LobbyDataPhase.Error });
                this.props.onStatusChanged('error');
            }
        }
    }

    componentDidMount() {
        this.handleLoadProfile();
    }

    componentWillUnmount() {
        this.isAlive = false;
    }

    render() {
        this.isAlive = true;
        return <div className="lobby-data-message">
            <img src="/static/media/loading.gif" alt="loading" />
            <Typography>Please wait...</Typography>
        </div>
    }
}

export default LobbyData;