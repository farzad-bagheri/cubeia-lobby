import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Alert from '@material-ui/lab/Alert';
import { Component } from "react";
import { connect } from 'react-redux';
import { Command } from '../../../common/define';
import { IStudio } from '../../../models/Studio';
import { IAppState } from '../../../redux/reducer';
import './Studios.css';

enum StudiosPhase {
    Initial = 1,
    Loaded = 2,
    Error = 3
}

interface IStateProps {
    studioId: number;
    studios: IStudio[];
}

interface IDispatchProps {
    handleSetStudio(studioId: number): void;
}

interface IOwnProps { }

interface IAllProps extends IStateProps, IDispatchProps, IOwnProps { }

class Studios extends Component<IAllProps> {

    state = { phase: StudiosPhase.Initial, expanded: true };

    componentDidMount() {
        if (window.lobbyData && window.lobbyData.studios) {
            this.setState({ phase: StudiosPhase.Loaded });
        }
        else {
            this.setState({ phase: StudiosPhase.Error });
        }
    }

    render() {
        let content = null;
        switch (this.state.phase) {
            case StudiosPhase.Initial:
                {
                    content = <Alert severity="info" variant="filled">Studios: Please wait...</Alert>
                    break;
                }
            case StudiosPhase.Loaded:
                {
                    let items = null;
                    if (this.props.studios.length === 0) {
                        items = <Alert severity="info" variant="filled" >Empty!</Alert>
                    } else {
                        items = this.props.studios.map((studio: IStudio) => {
                            return <Tooltip title={studio.name} arrow key={studio.id}>
                                <div className={this.props.studioId === studio.id ? "studios-item-active" : "studios-item"}
                                    style={{ backgroundImage: `url('${studio.imageUrl}')` }}
                                    onClick={_ => { this.props.handleSetStudio(studio.id) }}>
                                </div>
                            </Tooltip>
                        });
                    }
                    content = <div className="studios-list">{items} </div>
                    break;
                }
            case StudiosPhase.Error:
                {
                    content = <Alert severity="error" variant="filled">Studios: Data not available!</Alert>
                    break;
                }
            default:
                {
                    break;
                }
        }
        return <div>
            <Tooltip title="Toggle providers list" arrow>
                <IconButton
                    className={this.state.expanded ? "show-more-open" : "show-more-closed"}
                    onClick={_ => { this.setState({ expanded: !this.state.expanded }) }}>
                    <ExpandMoreIcon />
                </IconButton>
            </Tooltip>
            <Collapse in={this.state.expanded} timeout="auto">
                {content}
            </Collapse>
        </div>;
    }
}

export default connect<IStateProps, IDispatchProps, IOwnProps, IAppState>(
    (state: IAppState) => {
        return {
            studioId: state.studioId,
            studios: state.studios
        }
    }
    , dispatch => {
        return {
            handleSetStudio: (studioId: number) => { dispatch({ type: Command.SetStudio, studioId }) }
        }
    })(Studios);