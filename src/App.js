import React, {Component} from 'react';
import CSV from './ExportToCSV'
import Push from './Push'
import PubSub from 'pubsub-js';
import AppBar from 'material-ui/AppBar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LeftNav from 'material-ui/Drawer'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MenuItem from 'material-ui/MenuItem';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import '../node_modules/react-data-grid/dist/react-data-grid.css'

import {Link} from 'react-router'
injectTapEventPlugin();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            path: 'pets',
            pointers: []
        };
    };

    componentDidMount() {
        this.token = PubSub.subscribe('rows', this.subscriberRows);
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            path: nextProps.children.props.route.path
        })
    };

    componentWillUnmount() {
        PubSub.unsubscribe(this.token);
    };

    subscriberRows = (msg, data) => {
        this.setState({
            pointers: data
        });
    };

    getChildContext = () => {
        return {muiTheme: getMuiTheme(baseTheme)};
    };

    handleToggle = () => this.setState({open: !this.state.open});

    handleCloseUsers = () =>this.setState({open: false, path: 'users'});
    handleClosePets = () =>this.setState({open: false, path: 'pets'});


    render() {
        return (
            <div>
                <AppBar
                    title='BuzzMyPet BO'
                    onTitleTouchTap={this.handleToggle}
                    onLeftIconButtonTouchTap={this.handleToggle}
                    iconElementRight={<Push pointers={this.state.pointers} path={this.state.path}/>}
                    children={<CSV path={this.state.path}/>}
                />
                <LeftNav
                    docked={false}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}>
                    <Link onTouchTap={this.handleCloseUsers} to='/users'><MenuItem>Users</MenuItem></Link>
                    <Link onTouchTap={this.handleClosePets} to='/pets'><MenuItem>Pets</MenuItem></Link>
                    <Link onTouchTap={this.handleClosePets} to='/shelters'><MenuItem>Shelters</MenuItem></Link>
                </LeftNav>
                {this.props.children}
            </div>

        );
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};