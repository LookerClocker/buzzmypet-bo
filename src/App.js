import React, {Component} from 'react';

import AppBar from 'material-ui/AppBar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import LeftNav from 'material-ui/Drawer'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

import { Link } from 'react-router'

injectTapEventPlugin();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    };

    getChildContext = () => { return {muiTheme: getMuiTheme(baseTheme)};};

    handleToggle = () => this.setState({open: !this.state.open});

    handleClose = () =>this.setState({open: false});

    render() {

        return (
            <div>
                <AppBar
                    title='BuzzMyPets BO'
                    onTouchTap={this.handleToggle}
                    iconElementRight={<FlatButton label='to CSV'/>}
                />
                <LeftNav
                    docked={false}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}>
                        <MenuItem onTouchTap={this.handleClose}><Link to='/users'>Users</Link></MenuItem>
                        <MenuItem onTouchTap={this.handleClose}><Link to='/pets'>Pets</Link></MenuItem>
                </LeftNav>
                {this.props.children}
            </div>

        );
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};