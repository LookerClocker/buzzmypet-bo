import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import Json2csv from 'json2csv';

import {Toolbar, Data} from 'react-data-grid/addons';

var Selectors = Data.Selectors;

var Parse = require('parse').Parse;
var parseApplicationId = 'KzykKl3uejlA8eNvij0wbc45SS6XaZPqZM3FsIeV';
var parseJavaScriptKey = 'mplYkntmCwoNEhmH2uuuRPeRosulwSJwxtOqs1gh';
var parseMasterKey = 'r0J0D2CYbm6Gkilx2IdWO4tOGO2MrVe3SHVjD401';

Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

var columns = [
    {
        key: 'name',
        name: 'Name',
        sortable: true,
        filterable: true
    },
    {
        key: 'lastName',
        name: 'Last Name',
        sortable: true,
        filterable: true
    },
    {
        key: 'city',
        name: 'City',
        sortable: true,
        filterable: true
    },
    {
        key: 'email',
        name: 'Email',
        sortable: true,
        filterable: true
    },
    {
        key: 'phoneNo',
        name: 'Phone',
        sortable: true,
        filterable: true
    },
    {
        key: 'birthday',
        name: 'Birthday',
        sortable: true,
        filterable: true
    },
    {
        key: 'gender',
        name: 'Gender',
        sortable: true,
        filterable: true
    },
    {
        key: 'pets',
        name: 'Pets',
        sortable: true,
        filterable: true
    }
];

export default class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usersList: [],
            rows: [],
            filters: {},
            sortColumn: null,
            sortDirection: null
        };
    };

    componentDidMount() {
        var _this = this;

        this.getUsers(function (items) {
            _this.setState({
                usersList: items,
                rows: this.state.usersList
            });

        });
    };

    getRows = ()=> {
        return Selectors.getRows(this.state);
    };

    getSize = () => {
        return this.getRows().length;
    };

    rowGetter = (rowIdx)=> {
        var rows = this.getRows();
        return rows[rowIdx];
    };

    handleGridSort = (sortColumn, sortDirection)=> {
        var state = Object.assign({}, this.state, {sortColumn: sortColumn, sortDirection: sortDirection});
        this.setState(state);
    };

    handleFilterChange = (filter)=> {
        var newFilters = Object.assign({}, this.state.filters);
        if (filter.filterTerm) {
            newFilters[filter.column.key] = filter;
        } else {
            delete newFilters[filter.column.key];
        }
        this.setState({filters: newFilters});
    };

    onClearFilters = () => {
        this.setState({filters: {}});
    };

    getUsers(callback) {
        var _this = this;

        var query = new Parse.Query('User');
        query.limit(10000);
        query.include('pet');
        query.find({
            success: function (users) {
                console.log('USERS-> ',users);
                _this.setState({
                    usersList: users.map(function (user) {
                        return {
                            name: user.get('name'),
                            lastName: user.get('lastName'),
                            city: user.get('city'),
                            email: user.get('email'),
                            phoneNo: user.get('phoneNo') ? user.get('phoneNo') : 'no phone',
                            birthday: user.get('birthday') ? user.get('birthday').toLocaleDateString() : 'no date',
                            gender: user.get('gender') ? user.get('gender') : 'no gender',
                            // pets: user.get('pets') ? user.get('pets').map(function(pet){
                            //     return {
                            //         id: pet.id
                            //     }
                            // }): 'no pets'
                        }
                    }),
                    rows: users.map(function (user) {
                        return {
                            name: user.get('name'),
                            lastName: user.get('lastName'),
                            city: user.get('city'),
                            email: user.get('email'),
                            phoneNo: user.get('phoneNo') ? user.get('phoneNo') : 'no phone',
                            birthday: user.get('birthday') ? user.get('birthday').toLocaleDateString() : 'no date',
                            gender: user.get('gender') ? user.get('gender') : 'no gender',
                            // pets: user.get('pets') ? user.get('pets').map(function(pet){
                            //     return {
                            //         id: pet.id
                            //     }
                            // }): 'no pets'
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

    toCSV = ()=> {
        var fields = ['name', 'lastName', 'city', 'email','phoneNo','birthday', 'gender', 'pets'];
        var dataToCsv = this.state.rows.map(function (user) {
            return {
                name: user.name,
                lastName: user.lastName,
                city: user.city,
                email: user.email,
                phoneNo: (user.phoneNo) ? user.phoneNo : 'no phone',
                birthday: (user.birthday) ? user.birthday : 'no date',
                gender: (user.gender) ? user.gender : 'no gender',
                pets: (user.pets) ? user.pets : 'no pets'
            }
        });

        const filename = 'Users.csv';
        const csv = Json2csv({data: dataToCsv, fields: fields});

        var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        if (navigator.msSaveBlob) {
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
    };

    render() {
        console.log(this.state.usersList);
        return (
            <div>
                <button
                    className="col-md-offset-10 btn btn-success"
                    onClick={this.toCSV}>
                    to csv
                </button>
                <ReactDataGrid
                    onGridSort={this.handleGridSort}
                    columns={columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.getSize()}
                    minHeight={500}
                    toolbar={<Toolbar enableFilter={true}/>}
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}
                />
            </div>

        )
    };
};