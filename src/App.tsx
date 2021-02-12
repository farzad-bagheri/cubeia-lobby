import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Component } from 'react';
import * as define from './common/define';
import Base from './components/Base/Base';

const theme = createMuiTheme({
  palette: {
    primary: define.colorPrimary,
    secondary: define.colorSecondary
  }
});

class App extends Component {

  render() {
    return <ThemeProvider theme={theme}>
      <Base />
    </ThemeProvider>
  }

}

export default App;