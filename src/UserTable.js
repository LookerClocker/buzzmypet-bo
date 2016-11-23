import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import PubSub from 'pubsub-js';
import {Toolbar, Data, Filters} from 'react-data-grid/addons';
var Selectors = Data.Selectors;
var Parse = require('parse').Parse;

var columns = [
    {
        key: 'name',
        name: 'Name',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'lastName',
        name: 'Last Name',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'userName',
        name: 'User Name',
        sortable: true,
        filterable: true,
        editable: true
    },

    {
        key: 'city',
        name: 'City',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'email',
        name: 'Email',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'phoneNo',
        name: 'Phone',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'birthday',
        name: 'Age',
        sortable: true,
        filterable: true,
        filterRenderer: Filters.NumericFilter,
        editable: true,
        width: 80
    },
    {
        key: 'birthDate',
        name: 'Birthday',
        sortable: true,
        filterable: true,
        filterRenderer: Filters.NumericFilter,
        editable: true
    },
    {
        key: 'registrationDate',
        name: 'Registration Date',
        sortable: true,
        filterable: true,
        filterRenderer: Filters.NumericFilter,
        editable: true,
        width: 130
    },
    {
        key: 'gender',
        name: 'Gender',
        sortable: true,
        filterable: true,
        editable: true,
        width: 70
    },
    {
        key: 'pets',
        name: 'Pets',
        sortable: true,
        filterable: true,
        editable: true
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
            height: window.innerHeight
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
        query.count().then(function (number) {
            query.limit(1000);
            query.skip(0);
            query.addAscending('createdAt');
            query.include('pets');
            var allObj=[];

            for(var i=0; i<=number; i+=1000) {
                query.skip(i);
                query.find().then(function (users) {
                    allObj = allObj.concat(_this.fullFill(users));
                    _this.setState({
                        usersList: allObj,
                        rows: allObj
                    });
                    callback(users);
                });
            }
            console.log(number);
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

    //CALCULATE AGE FROM BIRTH DATE
    calculateAge(birthMonth, birthDay, birthYear) {
        var todayDate = new Date();
        var todayYear = todayDate.getFullYear();
        var todayMonth = todayDate.getMonth();
        var todayDay = todayDate.getDate();
        var age = todayYear - birthYear;

        if (todayMonth < birthMonth - 1) {
            age--;
        }

        if (birthMonth - 1 == todayMonth && todayDay < birthDay) {
            age--;
        }
        return age + ' years';
    };


    // FULLFILL USER`S ARRAY
    fullFill = (object)=> {
        var _this = this;
        return object.map(function (user) {
            return {
                id: user.id,
                createdAt: user.createdAt,
                name: user.get('name'),
                userName: user.get('username'),
                lastName: user.get('lastName'),
                city: user.get('city'),
                email: user.get('email'),
                phoneNo: user.get('phoneNo') ? user.get('phoneNo') : ' ',
                birthday: user.get('birthday') ? _this.calculateAge(user.get('birthday').getMonth(), user.get('birthday').getDate(), user.get('birthday').getFullYear()) : '',
                gender: user.get('gender') == 0 ? 'male' : user.get('gender') == 1 ? 'female' : '',
                pets: user.get('pets') ? user.get('pets').map(function (pet) {
                    return pet.get('breed');
                }).join(', ') : ' ',
                registrationDate: user.createdAt.toISOString().substring(0, 10),
                birthDate: user.get('birthday') ? user.get('birthday').toISOString().substring(0, 10) : '',
            }
        });
    };

    render() {
        PubSub.publish('rows', this.getRows());
        return (
            <div>
                <div className="row">
                    <div className="col-md-2">
                        <strong className="total">Total users: {this.getRows().length}</strong>
                    </div>
                </div>
                <ReactDataGrid
                    enableCellSelect={true}
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