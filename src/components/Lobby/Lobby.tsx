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
import Categories from './Categories/Categories';
import Games from './Games/Games';
import './Lobby.css';
import Studios from './Studios/Studios';

enum LobbyPhase {
    Initial = 1,
    Loaded = 2,
    Error = 3
}

interface IStateProps { categoryId: number }

interface IDispatchProps {
    handleSetCurrency: (currency: string) => void;
}

interface IOwnProps { }

interface IAllProps extends IStateProps, IDispatchProps, IOwnProps { }

class Lobby extends Component<IAllProps> {

    state = {
        phase: LobbyPhase.Initial,
        currency: 'EUR'
    };

    handleCurrencyChanged = (event: React.ChangeEvent<{ name?: string; value: unknown }>, child: React.ReactNode) => {
        const currency = event.target.value as string;
        if (currency) {
            this.setState({ currency });
            this.props.handleSetCurrency(currency);
        }
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
                            <div className="lobby-toolbar-items">
                                <a href="https://www.neobet.io/"><img src="/static/media/logo.svg" alt="logo" /></a>
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

                        <div className="lobby-content">
                            <Categories />
                            {this.props.categoryId >= 0 ?
                                <>
                                    <Studios />
                                    <div className="lobby-games">
                                        <Games editMode={true} />
                                    </div>
                                </> :
                                <div className="lobby-games">
                                    <Games editMode={false} />
                                </div>}
                        </div>

                        <div className="lobby-footer"></div>

                    </div>
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
    (state: IAppState) => { return { categoryId: state.categoryId } }
    , dispatch => {
        return {
            handleSetCurrency: (currency: string) => { dispatch({ type: Command.SetCurrency, currency }) }
        }
    })(Lobby);