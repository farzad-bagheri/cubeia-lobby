import Backdrop from '@material-ui/core/Backdrop';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import React, { Component } from "react";
import * as define from '../../../common/define';
import './Cookie.css';

class Cookie extends Component {

    isAlive = false;
    state = { showCookieMessage: false };

    onShowCookieMessage = () => {
        if (!this.isAlive)
            return;
        this.setState({ showCookieMessage: true });
    };

    onHideCookieMessage = () => {
        this.setState({ showCookieMessage: false });
    };

    componentDidMount = () => {
        setTimeout(this.onShowCookieMessage, 3000);
    };

    componentWillUnmount() {
        this.isAlive = false;
    }

    render() {
        this.isAlive = true;
        let content = <></>;
        if (this.state.showCookieMessage) {
            content = <Backdrop open={this.state.showCookieMessage} style={{ zIndex: 999 }}>
                <Card className="cookie-card">
                    <CardHeader
                        avatar={<InfoIcon />}
                        action={<IconButton color="primary" onClick={this.onHideCookieMessage}><CloseIcon /></IconButton>}
                        title="Note"
                        subheader="We use local storage" />
                    <CardContent>
                        <Typography variant="body1" align="justify">
                            <strong>{define.APP_NAME}</strong> uses local storage to deliver our services and personalise your experience. By using our service you agree to the use of this feature.
                        </Typography>
                    </CardContent>
                    <Divider />
                </Card>
            </Backdrop>
        }
        return content;
    }
}

export default Cookie;