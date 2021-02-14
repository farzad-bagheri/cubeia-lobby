import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { Component } from "react";
import { connect } from 'react-redux';
import { APP_NAME, Command, PageId, PageTitles } from '../../common/define';
import { IAppState } from '../../redux/reducer';
import Cookie from '../UI/Cookie/Cookie';
import SearchBox from '../UI/SearchBox/SearchBox';
import Categories from './Categories/Categories';
import Games from './Games/Games';
import './Lobby.css';
import Studios from './Studios/Studios';

enum LobbyPhase {
    Initial = 1,
    Loaded = 2,
    Error = 3
}

interface IStateProps { categoryId: number, isMobile: boolean }

interface IDispatchProps {
    handleSetCurrency: (currency: string) => void;
    handleSetGameFilterQuery: (gameFilterQuery: string) => void;
}

interface IOwnProps { }

interface IAllProps extends IStateProps, IDispatchProps, IOwnProps { }

class Lobby extends Component<IAllProps> {

    state = {
        phase: LobbyPhase.Initial, currency: 'EUR', query: '', queryError: undefined
    };

    handleCurrencyChanged = (event: React.ChangeEvent<{ name?: string; value: unknown }>, child: React.ReactNode) => {
        const currency = event.target.value as string;
        if (currency) {
            this.setState({ currency });
            this.props.handleSetCurrency(currency);
        }
    }

    handleQueryChange = (query: string, queryError: string | undefined) => {
        this.setState({ query, queryError });
        if (!queryError)
            this.props.handleSetGameFilterQuery(query);
    }

    componentDidMount() {
        document.title = `${APP_NAME} - ${PageTitles[PageId.Lobby].title}`;

        if (!window.lobbyData || !window.lobbyData.games) {
            this.setState({ phase: LobbyPhase.Error });
        }
        else {
            this.setState({ phase: LobbyPhase.Loaded });
        }
    }

    render() {
        let content = null;
        switch (this.state.phase) {
            case LobbyPhase.Initial:
                {
                    content = <Typography>Please wait...</Typography>
                    break;
                }
            case LobbyPhase.Loaded:
                {
                    content = <div>

                        <div className="lobby-toolbar">
                            <div className={this.props.isMobile ? "lobby-toolbar-items-mobile" : "lobby-toolbar-items"}>

                                <a href="https://www.neobet.io/"><img src="/static/media/logo.svg" alt="logo" /></a>

                                {this.props.isMobile ? <></> : <SearchBox
                                    title="Find in lobby"
                                    value={this.state.query}
                                    valueError={this.state.queryError}
                                    onChange={this.handleQueryChange} />}

                                <FormControl variant="standard">
                                    <InputLabel >Currency</InputLabel>
                                    <Select value={this.state.currency} onChange={this.handleCurrencyChanged}>
                                        <MenuItem value={'EUR'}>EUR</MenuItem>
                                        <MenuItem value={'USD'}>USD</MenuItem>
                                        <MenuItem value={'mBTC'}>mBTC</MenuItem>
                                    </Select>
                                </FormControl>

                            </div>
                        </div>

                        <div className="lobby-categories">
                            <Categories />
                        </div>

                        <div className="lobby-content">
                            <Studios />
                            <Games />
                        </div>

                        <Cookie />

                    </div >
                    break;
                }
            case LobbyPhase.Error:
                {
                    content = <div className="lobby-error">
                        <Alert severity="error" variant="filled">
                            <AlertTitle>Error</AlertTitle>
                            We could not retrieve data from server. Please reload the page to try again!
                        </Alert>
                    </div>
                    break;
                }
            default:
                {
                    break;
                }
        }
        return content
    }
}

export default connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(
    (state: IAppState) => {
        return {
            isMobile: state.isMobile,
            categoryId: state.categoryId
        }
    }
    , dispatch => {
        return {
            handleSetCurrency: (currency: string) => { dispatch({ type: Command.SetCurrency, currency }) },
            handleSetGameFilterQuery: (gameFilterQuery: string) => { dispatch({ type: Command.SetGameFilter, gameFilterQuery }) }
        }
    })(Lobby);