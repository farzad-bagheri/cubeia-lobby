import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Alert from '@material-ui/lab/Alert';
import { Component } from "react";
import { connect } from 'react-redux';
import { Command } from '../../../common/define';
import { ICategory } from '../../../models/Category';
import { IAppState } from '../../../redux/reducer';
import './Categories.css';

enum CategoriesPhase {
    Initial = 1,
    Loaded = 2,
    Error = 3
}

interface IStateProps {
    isMobile: boolean;
}

interface IDispatchProps {
    handleSetCategory(categoryId: number, studioIds: number[], gameIds: number[]): void;
    handleSetFavourites(): void;
}

interface IOwnProps { }

interface IAllProps extends IStateProps, IDispatchProps, IOwnProps { }

class Categories extends Component<IAllProps> {

    state = { phase: CategoriesPhase.Initial, tabIndex: 0 };

    contentTabs: JSX.Element[] = [];
    contentButtons: JSX.Element[] = [];

    handleTabIndexChanged = (event: React.ChangeEvent<{}>, value: any) => {
        this.setState({ tabIndex: value });
    }

    componentDidMount() {
        
        if (window.lobbyData && window.lobbyData.categories) {

            let sortedCategories: ICategory[] = window.lobbyData.categories.sort((a: ICategory, b: ICategory) => b.lobbyOrder - a.lobbyOrder);

            this.contentTabs = sortedCategories.map((category: ICategory) => {
                return <Tab key={category.id} label={category.name}
                    onClick={_ => { this.props.handleSetCategory(category.id, category.studios, category.games) }} />
            });

            this.contentTabs.push(<Tab key={-1} label="My Favourites"
                onClick={_ => { this.props.handleSetFavourites() }} />);

            this.contentButtons = sortedCategories.map((category: ICategory) => {
                return <Button variant="contained" color="primary" key={category.id}
                    onClick={_ => { this.props.handleSetCategory(category.id, category.studios, category.games) }}>
                    {category.name}</Button>
            });

            this.contentButtons.push(<Button variant="contained" color="primary" key={-1}
                onClick={_ => { this.props.handleSetFavourites() }}>
                My Favourites</Button>);

            const defaultCategoryIndex = sortedCategories.length - 1;
            const defaultCategory: ICategory = sortedCategories[defaultCategoryIndex];
            this.props.handleSetCategory(defaultCategory.id, defaultCategory.studios, defaultCategory.games);

            this.setState({ phase: CategoriesPhase.Loaded, tabIndex: defaultCategoryIndex });
        }
        else {
            this.setState({ phase: CategoriesPhase.Error });
        }
    }

    render() {
        let content = null;
        switch (this.state.phase) {
            case CategoriesPhase.Initial:
                {
                    content = <Alert severity="info" variant="filled">Categories: Please wait...</Alert>
                    break;
                }
            case CategoriesPhase.Loaded:
                {
                    content = this.props.isMobile ?
                        <div className="categories-buttons">{this.contentButtons}</div> :
                        <Tabs value={this.state.tabIndex} onChange={this.handleTabIndexChanged}
                            indicatorColor="primary" textColor="primary" variant="scrollable"
                            scrollButtons="auto">{this.contentTabs}</Tabs>
                    break;
                }
            case CategoriesPhase.Error:
                {
                    content = <Alert severity="error" variant="filled">Categories: Data not available!</Alert>
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
            isMobile: state.isMobile
        }
    }
    , dispatch => {
        return {
            handleSetCategory: (categoryId: number, studioIds: number[], gameIds: number[]) => { dispatch({ type: Command.SetCategory, categoryId, studioIds, gameIds }) },
            handleSetFavourites: () => { dispatch({ type: Command.SetFavourites }) }
        }
    })(Categories);