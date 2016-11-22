import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';

import PubSub from 'pubsub-js';

import {Toolbar, Data} from 'react-data-grid/addons';

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
        filterable: true,
        editable : true
    },
    {
        key: 'user',
        name: 'Owner',
        sortable: true,
        filterable: true,
        editable : true
    },
    {
        key: 'breed',
        name: 'Breed',
        sortable: true,
        filterable: true,
        editable : true
    },
    {
        key: 'age',
        name: 'Age',
        sortable: true,
        filterable: true,
        editable : true
    },
    {
        key: 'color',
        name: 'Color',
        sortable: true,
        filterable: true,
        editable : true
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
            sortDirection: null,
            height:window.innerHeight,
            lastSegment: window.location.href.split('/').pop()

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
        query.limit(1000);
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
                user: (pet.get('user')) ? pet.get('user').get('name') : " ",
                breed: pet.get('breed'),
                age:  pet.get('age') ? pet.get('age') >= 100 ? Math.round(pet.get('age') / 100) + ' years' : pet.get('age') + ' months' : '',
                color: pet.get('color')
            }
        });
    };

    render() {
        PubSub.publish('rows', this.getRows());
        return (
            <div>
                <strong className="total">Total pets: {this.getRows().length}</strong>
                <ReactDataGrid
                    enableCellSelect={true}
                    onGridSort={this.handleGridSort}
                    columns={columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.getSize()}
                    minHeight={this.state.height}
                    toolbar={<Toolbar enableFilter={true}/>}
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}/>
            </div>
        )
    };
};