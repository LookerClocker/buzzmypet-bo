import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import Json2csv from 'json2csv';

var Parse = require('parse').Parse;

var parseApplicationId = 'KzykKl3uejlA8eNvij0wbc45SS6XaZPqZM3FsIeV';
var parseJavaScriptKey = 'mplYkntmCwoNEhmH2uuuRPeRosulwSJwxtOqs1gh';
var parseMasterKey = 'r0J0D2CYbm6Gkilx2IdWO4tOGO2MrVe3SHVjD401';

Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

var columns = [
    {
        key: 'name',
        name: 'Name',
    },
    {
        key: 'lastName',
        name: 'Last Name',
    },
    {
        key: 'city',
        name: 'City',
    },
    {
        key: 'email',
        name: 'Email'
    }
];

export default class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usersList: []
        };

        this.rowGetter = this.rowGetter.bind(this);
        this.toCSV = this.toCSV.bind(this);
    };

    componentDidMount() {
        var _this = this;

        this.getUsers(function (items) {
            _this.setState({
                usersList: items
            });
        });
    };

    getUsers(callback) {
        var _this = this;

        var query = new Parse.Query('User');
        query.limit(10000);
        query.find({
            success: function (users) {
                _this.setState({
                    usersList: users.map(function (user) {
                        return {
                            name: user.get('name'),
                            lastName: user.get('lastName'),
                            city: user.get('city'),
                            email: user.get('email')
                        }
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

    rowGetter(i) {
        return this.state.usersList[i];
    };

    toCSV() {
        var fields = ['name', 'lastName', 'city', 'email'];
        var dataToCsv = this.state.usersList.map(function (user) {
            return {
                name: user.get('name'),
                lastName: user.get('lastName'),
                city: user.get('city'),
                email: user.get('email')
            }
        });

        const filename = 'Users.csv';
        const csv = Json2csv({data: dataToCsv, fields: fields});

        var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        }
        else {
            var link = document.createElement('a');

            if (link.download !== undefined) {

                var url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    render() {
        return (
            <div>
                <button
                    className="col-md-offset-10 btn btn-success"
                    onClick={this.toCSV}>
                    to csv
                </button>
                <ReactDataGrid
                    idProperty="id"
                    dataSource={this.state.usersList}
                    columns={columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.usersList.length}
                    minHeight={400}/>
            </div>

        )
    };
};