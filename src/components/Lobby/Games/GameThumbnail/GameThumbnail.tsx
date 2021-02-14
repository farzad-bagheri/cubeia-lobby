import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NotFavoriteIcon from '@material-ui/icons/FavoriteBorder';
import React, { Component } from "react";
import { IGame } from '../../../../models/Game';
import './GameThumbnail.css';

interface IGameThumbnailProps {
    game: IGame;
}

export default class GameThumbnail extends Component<IGameThumbnailProps>
{
    state = { favorite: false };
    imageRef = React.createRef<HTMLImageElement>();

    handleToggleFavourite = () => {
        if (window.favouriteGames) {
            const favorite = window.favouriteGames.toggleGame(this.props.game);
            this.setState({ favorite });
        }
    }

    handleOnMouseOver = (event: React.MouseEvent<HTMLDivElement>) => {
        if (window.gsap && this.imageRef.current) {
            window.gsap.to(this.imageRef.current, { y: -8, duration: 0.1 });
        }
    }

    handleOnMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
        if (window.gsap && this.imageRef.current) {
            window.gsap.to(this.imageRef.current, { y: 0, duration: 0.1 });
        }
    }

    componentDidMount() {
        if (window.favouriteGames) {
            this.setState({ favorite: window.favouriteGames.isFavorite(this.props.game.id) });
        }
    }

    render() {

        const favoriteButon = <Tooltip title="Toggle favourite" arrow>
            <IconButton color="secondary" onClick={this.handleToggleFavourite}>
                {this.state.favorite ? <FavoriteIcon /> : <NotFavoriteIcon />}
            </IconButton>
        </Tooltip>

        let gameName = this.props.game.name;
        if (gameName.length > 16) {
            gameName = gameName.substr(0, 16) + '...';
        }
        return <Card className="game-thumbnail"
            onMouseOver={this.handleOnMouseOver} onMouseLeave={this.handleOnMouseLeave}>
            <CardHeader title={gameName} subheader={this.props.game.studio.name}
                action={favoriteButon} />
            <CardContent>
                <img ref={this.imageRef} src={this.props.game.imageUrl} />
            </CardContent>
        </Card>

    }
}