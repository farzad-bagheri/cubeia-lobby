import { Typography } from '@material-ui/core';
import { Component } from 'react';
import { FavouriteGamesController } from '../../controllers/FavouriteGames';
import { LobbyDataController } from '../../controllers/LobbyData';
import { ILobbyData } from '../../models/LobbyData';
import './LobbyData.css';

enum LobbyDataPhase {
    Initial = 1,
    Waiting = 2,
    Loaded = 3,
    Error = 4
}

declare global {
    interface Window {
        lobbyData: ILobbyData | undefined;
        favouriteGames: FavouriteGamesController | undefined;
    }
}

class LobbyData extends Component<{ onStatusChanged: (result: 'loaded' | 'error') => void }> {

    isAlive = false;

    state = { phase: LobbyDataPhase.Initial };

    handleLoadProfile = async () => {
        this.setState({ phase: LobbyDataPhase.Waiting });
        try {
            const lobbyDataController = new LobbyDataController();
            await lobbyDataController.load();
            if (this.isAlive) {
                lobbyDataController.optimize();
                window.lobbyData = lobbyDataController.lobbyData;
            }

            const favouriteGamesController = new FavouriteGamesController();
            favouriteGamesController.load();
            window.favouriteGames = favouriteGamesController;

            this.props.onStatusChanged('loaded');
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