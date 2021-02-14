import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import SearchIcon from '@material-ui/icons/Search';
import React, { Component } from "react";

interface ISearchBoxProps {
    title: string;
    value: string;
    valueError: string | undefined;
    onChange: (query: string, queryError: string | undefined) => void;
}

class SearchBox extends Component<ISearchBoxProps> {

    validateQuery(query: string): string | undefined {
        if (query.match(/[^a-zA-Z 0-9]/)) {
            return 'Only english letters and digits are allowed.'
        }
        return undefined;
    }

    handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange) {
            const query = event.target.value;
            const queryError = this.validateQuery(query);
            this.props.onChange(query, queryError);
        }
    }

    render() {
        const startAdornment = <InputAdornment position="end" style={{ color: 'lightgray' }} ><SearchIcon /></InputAdornment>

        return <FormControl fullWidth>
            <InputLabel>{this.props.title}</InputLabel>
            <Input type="email"
                value={this.props.value} onChange={this.handleValueChange} error={Boolean(this.props.valueError)}
                endAdornment={startAdornment} />
            <FormHelperText error={true}>{this.props.valueError}</FormHelperText>
        </FormControl>
    }
}

export default SearchBox;