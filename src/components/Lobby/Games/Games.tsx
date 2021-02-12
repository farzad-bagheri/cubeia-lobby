import Alert from '@material-ui/lab/Alert';
import { Component } from "react";
import { connect } from 'react-redux';
import { IGame } from '../../../models/Game';
import { IAppState } from '../../../redux/reducer';
import './Games.css';
import GameThumbnail from './GameThumbnail/GameThumbnail';

enum GamesPhase {
    Initial = 1,
    Loaded = 2,
    Error = 3
}

interface IStateProps {
    games: IGame[];
}

interface IDispatchProps { }

interface IOwnProps {
    editMode: boolean;
}

interface IAllProps extends IStateProps, IDispatchProps, IOwnProps { }

class Games extends Component<IAllProps> {

    state = { phase: GamesPhase.Initial };

    componentDidMount() {
        if (window.lobbyData && window.lobbyData.games) {
            this.setState({ phase: GamesPhase.Loaded });
        }
        else {
            this.setState({ phase: GamesPhase.Error });
        }
    }

    render() {
        let content = null;
        switch (this.state.phase) {
            case GamesPhase.Initial:
                {
                    content = <Alert severity="info" variant="filled"> Games: Please wait...</Alert>
                    break;
                }
            case GamesPhase.Loaded:
                {
                    if (this.props.games.length == 0) {
                        content = <div className="games-content">
                            <Alert severity="info" variant="filled">No game matched the filter. Please check your input.</Alert>
                            <img src="/static/media/not_found.svg" alt="error" />
                        </div>
                    }
                    else {
                        const thumbnails = this.props.games.map((game: IGame) => {
                            return <GameThumbnail key={game.id}
                                editMode={this.props.editMode}
                                game={game}
                            />
                        });

                        content = <div className="games-grid">
                            {thumbnails}
                        </div>
                    }
                    break;
                }
            case GamesPhase.Error:
                {
                    content = <div className="games-content">
                        <Alert severity="error" variant="filled" >Data are not available! Please refresh the page to retry.</Alert>
                        <img src="/static/media/error.svg" alt="error" />
                    </div>
                    break;
                }
            default:
                {
                    break;
                }
        }
        return content;
    }
}

export default connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(
    (state: IAppState) => {
        return {
            games: (state.categoryId < 0 ? window.lobbyData.favouriteGames : state.games)
        }
    }
    , dispatch => { return {} })(Games);