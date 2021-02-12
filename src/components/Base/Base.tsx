import { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Command, PagePath } from '../../common/define';
import { IAppState } from '../../redux/reducer';
import Error404 from '../Error404/Error404';
import Lobby from '../Lobby/Lobby';
import LobbyData from '../LobbyData/LobbyData';

interface IStateProps { }

interface IDispatchProps {
  handleSetIsMobile(isMobile: boolean): void;
}

interface IOwnProps { }

interface IAllProps extends IStateProps, IDispatchProps, IOwnProps { }

class Base extends Component<IAllProps>{

  state = { loadingLobbyData: true };

  mediaQuery: MediaQueryList | undefined;

  handleLobbyDataStatusChanged = () => {
    this.setState({ loadingLobbyData: false });
  }

  render() {
    if (this.state.loadingLobbyData) {
      return <LobbyData onStatusChanged={this.handleLobbyDataStatusChanged} />
    }

    return <BrowserRouter>
      <Switch>
        <Route path={PagePath.Lobby} exact component={Lobby} />
        <Route component={Error404} />
      </Switch>
    </BrowserRouter>
  }

  handleMediaQueryChange = (e: MediaQueryListEventMap['change']) => {
    this.props.handleSetIsMobile(e.matches);
  }

  componentDidMount() {
    this.mediaQuery = window.matchMedia('(max-width: 768px)');
    this.mediaQuery.addEventListener('change', this.handleMediaQueryChange);
    this.props.handleSetIsMobile(this.mediaQuery.matches);
  }

  componentWillUnmount() {
    this.mediaQuery?.removeEventListener('change', this.handleMediaQueryChange);
  }

}

export default connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(
  (state: IAppState) => { return {} }
  , dispatch => {
    return {
      handleSetIsMobile: (isMobile: boolean) => { dispatch({ type: Command.SetIsMobile, isMobile }) }
    }
  })(Base);