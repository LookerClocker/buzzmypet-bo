import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data, Filters} from 'react-data-grid/addons';
import {Link} from 'react-router'
import LinkToShelters from './LinkToShelter'
import LinkToDelete from './LinkToDelete'
var Selectors = Data.Selectors;
import PubSub from 'pubsub-js';
var Parse = require('parse').Parse;



export default class Shelters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parseShelters: [],
            shelters: [],
            rows: [],
            height: window.innerHeight
        }
    }

    componentDidMount() {
        var _this = this;

        this.getShelters(function (items) {
            _this.setState({
                parseShelters: items,
                shelters: _this.fullFill(items),
                rows: _this.fullFill(items)
            });
        })
    };

    getShelters=(callback)=> {
        var query = new Parse.Query('Shelter');
        query.limit(1000);
        query.ascending('createdAt');
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

    deleteShelter=(id)=> {
        console.log("deleteShelter!! ", id);
        var _this = this;
        console.log(this.getShelterById);
        var shelter = this.getShelterById(id);
        console.log(shelter);
        if (confirm('Are you sure you want to delete user?')) {

          shelter.destroy({
            success: function(personName) {
              console.log("success destroy");
                _this.getShelters(function (items) {
                  console.log("items new after destroy " , items.length);
                    _this.setState({
                        shelters: _this.fullFill(items),
                        rows: _this.fullFill(items)
                    });
                })
            },
            error: function(personName, error) {
              console.log("error destroy");

            }

          });
        }
    };

    getShelterById = (id)=> {
        var shelters = this.state.parseShelters;
        if (shelters.length == 0) return [];

        for (var i = 0; i < shelters.length; i++) {
            if (shelters[i].id == id) {
                return shelters[i];
            }
        }
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
                    columns={[
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
                        {
                            key: 'shelterDelete',
                            name: 'Delete',
                            sortable: true,
                            formatter: LinkToDelete,
                            getRowMetaData: (row) => {
                              return {
                                id: row.id,
                                delete: this.deleteShelter
                              }
                            },
                            width:80
                        },
                    ]}
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
