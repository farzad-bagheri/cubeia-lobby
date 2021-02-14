import { Typography } from '@material-ui/core';
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

    state = { phase: StudiosPhase.Initial, expanded: false };

    mapStudios = (studios: IStudio[]) => {
        return studios.map((studio: IStudio) => {
            return <Tooltip title={studio.name} arrow key={studio.id}>
                <div className={this.props.studioId === studio.id ? "studios-item-active" : "studios-item"}
                    style={{ backgroundImage: `url('${studio.imageUrl}')` }}
                    onClick={_ => { this.props.handleSetStudio(studio.id) }}>
                </div>
            </Tooltip>
        });
    }

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
                    if (this.props.studios.length === 0) {
                        content = <div className="studios-message">
                            <Alert severity="info" variant="filled" >No provider available!</Alert>
                        </div>
                    } else {

                        if (this.props.studios.length > 8) {
                            const items1 = this.mapStudios(this.props.studios.slice(0, 8));
                            const items2 = this.mapStudios(this.props.studios.slice(8));

                            content = <div>
                                <div className="studios-list">{items1}</div>
                                <div className="studios-collapse">
                                    <Typography color="primary">{this.state.expanded ? "Less" : "More"}</Typography>
                                    <Tooltip title="Toggle more providers" arrow>
                                        <IconButton color="primary"
                                            className={this.state.expanded ? "show-more-open" : "show-more-closed"}
                                            onClick={_ => { this.setState({ expanded: !this.state.expanded }) }}>
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <Collapse in={this.state.expanded} timeout="auto">
                                    <div className="studios-list">{items2}</div>
                                </Collapse>
                            </div>
                        }
                        else {
                            const items = this.mapStudios(this.props.studios);
                            content = <div className="studios-list">{items}</div>
                        }
                    }
                    break;
                }
            case StudiosPhase.Error:
                {
                    content = <div className="studios-message">
                        <Alert severity="error" variant="filled">Studios: Data not available!</Alert>
                    </div>
                    break;
                }
            default:
                {
                    break;
                }
        }
        return <div className="studios-layout">{content}</div>;
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