import React, {Component} from 'react';
import UsersTable from './UserTable';
import PetsTable from './PetTable';

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
                <h1>users</h1>
                <UsersTable/>
                <h1>pets</h1>
                <PetsTable/>

            </div>
        );
    }
}