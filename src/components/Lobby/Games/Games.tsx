import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import { Component } from "react";
import { connect } from 'react-redux';
import { GameController } from '../../../controllers/Game';
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
    categoryId: number;
    pageCount: number;
    gameFilterQuery: string;
    games: IGame[];
}

interface IDispatchProps { }

interface IOwnProps { }

interface IAllProps extends IStateProps, IDispatchProps, IOwnProps { }

class Games extends Component<IAllProps> {

    state = { phase: GamesPhase.Initial, currentPage: 1, gamesLength: 0 };

    handleChangePage = (e: any, currentPage: number) => {
        this.setState({ currentPage });
    }

    getGamesList = (): IGame[] => {
        let i1 = (this.state.currentPage - 1) * GameController.itemPerPage;
        let i2 = i1 + GameController.itemPerPage;
        let games = this.props.games.slice(i1, i2);
        if (this.props.gameFilterQuery.length > 0) {
            const regExp = new RegExp(`${this.props.gameFilterQuery}`, 'i');
            games = games.filter((game: IGame) => {
                return game.name.match(regExp);
            });
        }
        return games;
    }

    static getDerivedStateFromProps(nextProps: IAllProps, prevState: { gamesLength: number }) {
        if (nextProps.games.length !== prevState.gamesLength) {
            return { currentPage: 1, gamesLength: nextProps.games.length };
        }
        return null;
    }

    componentDidMount() {
        if (window.lobbyData && window.lobbyData.games) {
            this.setState({ phase: GamesPhase.Loaded, currentPage: 1 });
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
                    const games = this.getGamesList();
                    if (games.length == 0) {
                        const msg = this.props.categoryId < 0 ? 'The favourite list is empty!' : 'No game matched the filter. Please check your input.';
                        content = <Alert severity="info" variant="filled">{msg}</Alert>
                    }
                    else {
                        content = games.map((game: IGame) => {
                            return <GameThumbnail key={game.id} game={game} />
                        });
                    }
                    break;
                }
            case GamesPhase.Error:
                {
                    content = <Alert severity="error" variant="filled" >Data are not available! Please refresh the page to retry.</Alert>
                    break;
                }
            default:
                {
                    break;
                }
        }
        return <div className="games-box">
            <div className="games-grid">{content}</div>
            <div className="games-pagination">
                <Pagination
                    color="primary"
                    count={this.props.pageCount}
                    page={this.state.currentPage}
                    onChange={this.handleChangePage} />
            </div>
        </div>
    }
}

export default connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(
    (state: IAppState) => {
        const games = state.categoryId < 0 ? window.favouriteGames?.games! : state.games;
        return {
            categoryId: state.categoryId,
            gameFilterQuery: state.gameFilterQuery,
            games,
            pageCount: GameController.getPageCount(games.length)
        }
    }
    , dispatch => { return {} })(Games);