import React, {Component} from 'react';
import UserTable from './UserTable';

// import LeftNav from 'material-ui/Snackbar';
// import AppBar from 'material-ui/AppBar';
// import MenuItem  from 'material-ui/MenuItem';
// import ThemeManager  from 'material-ui/styles/MuiThemeProvider';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {

        return (
            <div>
                <UserTable/>
            </div>
        );
    }
}