import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { Component } from "react";
import { Link } from 'react-router-dom';
import { APP_NAME, PageId, PagePath, PageTitles } from '../../common/define';
import './Error404.css';

export default class Error404 extends Component {

    componentDidMount() {
        document.title = `${APP_NAME} - ${PageTitles[PageId.Error].title}`;
    }

    render() {
        return <div className="error404-bg">
            <div className="simple-grid">
                <img src="/static/media/404.svg" alt="error 404" />
                <Alert severity="error" variant="filled">
                    <AlertTitle>Error</AlertTitle>
                    We can not find the requested page!
                </Alert>
                <Link to={PagePath.Lobby} className="cubeia-link">
                    <ListItem>
                        <ListItemIcon>
                            <HomeIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary="Go to Casino Lobby" />
                    </ListItem>
                </Link>
            </div>
        </div>
    }
}