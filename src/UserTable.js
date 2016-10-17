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
                    }),
                    rows: users.map(function (user) {
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

    toCSV = ()=> {
        var fields = ['name', 'lastName', 'city', 'email'];
        var dataToCsv = this.state.rows.map(function (user) {
            return {
                name: user.name,
                lastName: user.lastName,
                city: user.city,
                email: user.email
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
        return (
            <div>
                <button
                    className="col-md-offset-10 btn btn-success"
                    onClick={this.toCSV}>
                    to csv
                </button>
                <ReactDataGrid
                    idProperty="id"
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