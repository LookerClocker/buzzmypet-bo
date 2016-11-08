import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';

import PubSub from 'pubsub-js';

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
        key: 'user',
        name: 'Owner',
        sortable: true,
        filterable: true
    },
    {
        key: 'breed',
        name: 'Breed',
        sortable: true,
        filterable: true
    },
    {
        key: 'age',
        name: 'Age',
        sortable: true,
        filterable: true
    },
    {
        key: 'color',
        name: 'Color',
        sortable: true,
        filterable: true
    }
];

export default class PetsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            petsList: [],
            rows: [],
            filters: {},
            sortColumn: null,
            sortDirection: null
        };
    };

    componentDidMount() {
        var _this = this;

        this.getPets(function (items) {
            _this.setState({
                petsList: items,
                rows: this.state.petsList
            });
        });
    };

    // GET PETS FROM PARSE.COM
    getPets(callback) {
        var _this = this;

        var query = new Parse.Query('Pet');
        query.limit(10000);
        query.include('user');
        query.find({
            success: function (pets) {
                _this.setState({
                    petsList: _this.fullFill(pets),
                    rows: _this.fullFill(pets)
                });
                callback(pets);
            },
            error: function (error) {
                console.error('getPets() error', error);
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

    // FULLFILL USER`S ARRAY
    fullFill = (object)=> {
        return object.map(function (pet) {
            return {
                name: pet.get('name'),
                user: (pet.get('user')) ? pet.get('user').get('name') : "no name",
                breed: pet.get('breed'),
                age: pet.get('age'),
                color: pet.get('color')
            }
        });
    };

    render() {
        PubSub.publish('rows', this.getRows());
        return (
            <div>
                <ReactDataGrid
                    onGridSort={this.handleGridSort}
                    columns={columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.getSize()}
                    minHeight={500}
                    toolbar={<Toolbar enableFilter={true}/>}
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}/>
            </div>
        )
    };
};