import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NotFavoriteIcon from '@material-ui/icons/FavoriteBorder';
import { Component } from "react";
import { IGame, inFavorites, toggleFavoriteGame } from '../../../../models/Game';
import './GameThumbnail.css';

interface IGameThumbnailProps {
    game: IGame;
    editMode: boolean;
}

export default class GameThumbnail extends Component<IGameThumbnailProps>
{

    state = { favorite: false };

    handleAddToFavorites = () => {
        const favorite = toggleFavoriteGame(this.props.game);
        this.setState({ favorite });
    }

    componentDidMount() {
        this.setState({ favorite: inFavorites(this.props.game.id) });
    }

    render() {

        const favoriteButon = this.props.editMode ? <Tooltip title="Add to favorites" arrow>
            <IconButton color="secondary" onClick={this.handleAddToFavorites}>
                {this.state.favorite ? <FavoriteIcon /> : <NotFavoriteIcon />}
            </IconButton>
        </Tooltip> : null;

        return <Card className="game-thumbnail">
            <CardHeader title={this.props.game.name} subheader={this.props.game.studio.name}
                action={favoriteButon} />
            <CardContent>
                <img src={this.props.game.imageUrl} />
            </CardContent>
        </Card>

    }
}