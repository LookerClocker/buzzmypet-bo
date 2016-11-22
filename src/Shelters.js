import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data, Filters} from 'react-data-grid/addons';
import {Link} from 'react-router'
import LinkToShelters from './LinkToShelter'
var Selectors = Data.Selectors;
import PubSub from 'pubsub-js';
var Parse = require('parse').Parse;

var columns = [
    {
        key: 'title',
        name: 'Title',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'address',
        name: 'Address',
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
        key: 'phone',
        name: 'Phone',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'email',
        name: 'Email',
        sortable: true,
        filterable: true,
        editable: true,
        width:150
    },
    {
        key: 'createdAt',
        name: 'Created at',
        sortable: true,
        filterRenderer: Filters.NumericFilter,
        filterable: true,
        editable: true,
        width:150
    },
    {
        key: 'shelter',
        name: 'Edit',
        sortable: true,
        formatter: LinkToShelters,
        getRowMetaData: (row) => row.id,
        width:60
    },
];

export default class Shelters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shelters: [],
            rows: [],
            height: window.innerHeight
        }
    }

    componentDidMount() {
        var _this = this;

        this.getShelters(function (items) {
            _this.setState({
                shelters: _this.fullFill(items),
                rows: _this.fullFill(items)
            });
        })
    };

    getShelters=(callback)=> {
        var query = new Parse.Query('Shelter');
        query.limit(1000);
        query.find({
            success: function (shelters) {
                callback(shelters);
            },
            error: function (error) {
                console.error('getShelters() error', error);
                callback(null, error);
            }
        });
    };

    fullFill=(object)=>{
        return object.map(function (shelter) {
            return {
                id: shelter.id,
                title: shelter.get('title'),
                createdAt: shelter.get('createdAt').toISOString().substring(0, 10),
                address: shelter.get('address') ? shelter.get('address') : '',
                phone: shelter.get('phone') ? shelter.get('phone') : '',
                city: shelter.get('city') ? shelter.get('city') : '',
                email: shelter.get('email') ? shelter.get('email') : '',
                location: shelter.get('location') ? shelter.get('location') : '',
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

    render() {
        PubSub.publish('rows', this.getRows());
        return (
            <div>
                <div className="total-shelters"><strong>Total shelters:{this.getRows().length}</strong></div>
                <Link to="new_shelter"><button className="btn btn-default add_shelter">Add shelter</button></Link>
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
    }
}