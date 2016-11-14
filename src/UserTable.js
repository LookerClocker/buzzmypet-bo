import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';

import PubSub from 'pubsub-js';

import {Toolbar, Data, Filters} from 'react-data-grid/addons';

var Selectors = Data.Selectors;

var Parse = require('parse').Parse;
var parseApplicationId = 'OeSDM2dUt2TIT97ywwU0gIxUkp9qhXP2wrJgLaXa';
var parseJavaScriptKey = 'o5xVoA2ijwywj1FueOyZuocgMVqzW3Zt73mPA4LX';
var parseMasterKey = 'LLsfJljO4HHCCZktxpgVsCLeF8fQJB1Gw5UqqHjL';

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
        name: 'Age',
        sortable: true,
        filterable: true,
        filterRenderer: Filters.NumericFilter
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
            sortDirection: null,
            height:window.innerHeight
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

    // GET USERS FROM PARSE.COM
    getUsers(callback) {
        var _this = this;

        var query = new Parse.Query('User');
        query.limit(10000);
        query.include('pets');
        query.find({
            success: function (users) {
                _this.setState({
                    usersList: _this.fullFill(users),
                    rows: _this.fullFill(users)
            });
                callback(users);
            },
            error: function (error) {
                console.error('getUser() error', error);
                callback(null, error);
            }
        });
    };

    // REACT DATA GRID BUILD-IN METHODS
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

    // CALCULATE AGE FROM BIRTH DATE
    getAge = (born, now) => {
        var birthday = new Date(now.getFullYear(), born.getMonth(), born.getDate());
        if (now >= birthday)
            return now.getFullYear() - born.getFullYear();
        else
            return now.getFullYear() - born.getFullYear() - 1;
    };

    calculateAge = (date)=> {
        var dob = date;
        var now = new Date();
        var birthdate = dob.split('/');
        var born = new Date(birthdate[2], birthdate[1] - 1, birthdate[0]);
        var age = this.getAge(born, now);

        return age;
    };

    // FULLFILL USER`S ARRAY
    fullFill = (object)=> {
        var _this = this;
        return object.map(function (user) {
            return {
                name: user.get('name'),
                lastName: user.get('lastName'),
                city: user.get('city'),
                email: user.get('email'),
                phoneNo: user.get('phoneNo') ? user.get('phoneNo') : 'no phone',
                birthday: user.get('birthday') ? _this.calculateAge(user.get('birthday').toLocaleDateString()) : 'no date',
                gender: user.get('gender') ? user.get('gender') : 'no gender',
                pets: user.get('pets') ? user.get('pets').map(function (pet) {
                    return pet.get('breed');
                }).join(', ') : 'no pets'
            }
        });
    };

    render() {
        PubSub.publish('rows', this.getRows());
        return (
            <div className="move-grid">
                <ReactDataGrid
                    onGridSort={this.handleGridSort}
                    columns={columns}
                    rowGetter={this.rowGetter}
                    minHeight={this.state.height}
                    rowsCount={this.getSize()}
                    toolbar={<Toolbar enableFilter={true}/>}
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}
                />
            </div>

        )
    };
};