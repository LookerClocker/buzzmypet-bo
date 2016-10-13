import React, {Component} from 'react';
import UserTable from './UserTable';

// import LeftNav from 'material-ui/Snackbar';
// import AppBar from 'material-ui/AppBar';
// import MenuItem  from 'material-ui/MenuItem';
// import ThemeManager  from 'material-ui/styles/MuiThemeProvider';

var Parse = require('parse').Parse;

var parseApplicationId = 'KzykKl3uejlA8eNvij0wbc45SS6XaZPqZM3FsIeV';
var parseJavaScriptKey = 'mplYkntmCwoNEhmH2uuuRPeRosulwSJwxtOqs1gh';
var parseMasterKey = 'r0J0D2CYbm6Gkilx2IdWO4tOGO2MrVe3SHVjD401';

Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usersList: [],
            showUsers: false
        };
    };
    // componentDidMount () {
    //     var _this = this;
    //
    //     this.getUsers(function (items) {
    //         _this.setState({
    //             usersList: items.map(function(user){
    //                 return user.get('name');
    //             })
    //         });
    //     });
    // };

    getUsers(callback) {
        console.log('log');
        var self = this;
        var query = new Parse.Query('User');
        query.limit(10000);
        query.find({
            success: function (users) {
                console.log('before func-> ',this.state.usersList);
                self.setState({
                    showUsers: !self.state.showUsers,
                    usersList: users.map(function(user) {
                        return user.get('name');
                    })
                });
                callback(users);
            },
            error: function (error) {
                console.error('getUser() error', error);
                callback(null, error);
            }
        });
    };

    render() {
        console.log('user array -> ',this.state.usersList);
        console.log('user show -> ',this.state.showUsers);
        var container;
        if(this.state.showUsers) {
            container = <UserTable userList={this.state.usersList}/>;
        }
        else {
            container='bla';
        }

        return (
            <div>
                <button onClick={this.getUsers}>get users</button>
                {container}
            </div>
        );
    }
}