import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import PubSub from 'pubsub-js';
import {Toolbar, Data} from 'react-data-grid/addons';
var Selectors = Data.Selectors;
var Parse = require('parse').Parse;
var _ = require('underscore');

var columns = [
    {
        key: 'name',
        name: 'Name',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'user',
        name: 'Owner',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'breed',
        name: 'Breed',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'age',
        name: 'Age',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'color',
        name: 'Color',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'status',
        name: 'Status',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'updated',
        name: 'UpdatedAt',
        sortable: true,
        filterable: true,
        editable: true
    },
    {
        key: 'id',
        name: 'Id',
        sortable: true,
        filterable: true,
        editable: true
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
            height: window.innerHeight,
            lastSegment: window.location.href.split('/').pop(),
            nextRows: []
        };
    };

    componentDidMount() {
        var _this = this;


        this.getPetsFromAlerts(function (items) {
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
        query.count().then(function (number) {
            query.limit(1000);
            query.skip(0);
            query.addAscending('createdAt');
            var allObj=[];
            query.include('user');

            for(var i=0; i<=number; i+=1000) {
                query.skip(i);
                query.find().then(function (pets) {
                    allObj = allObj.concat(_this.fullFill(pets));
                    _this.setState({
                        petsList: allObj,
                        rows: allObj
                    });

                    callback(pets);
                });
            }

            console.log(number);
        });
    };

    getPetsFromAlerts(callback) {
        var _this = this;
        var query = new Parse.Query('Alert');
        query.exists('pet');
        query.include('pet');
        query.count().then(function (number) {
            query.limit(1000);
            query.skip(0);
            query.addAscending('createdAt');
            var allObj=[];
            query.include('user');

            for(var i=0; i<=number; i+=1000) {
                query.skip(i);
                query.find().then(function (pets) {
                  console.log(pets);
                  var sorted = pets.sort(function(a, b) {
                    if(a.get('pet').id < b.get('pet').id) return -1;
                    if(a.get('pet').id > b.get('pet').id) return 1;
                    return 0;
                  });
                  var reversed = sorted.reverse();
                  var unique = _.unique(reversed,function(d){ return d.get('pet').id});
                  var final = unique.reverse();
                  allObj = allObj.concat(_this.fullFill(final));
                    _this.setState({
                        petsList: allObj,
                        rows: allObj
                    });

                    callback(pets);
                });
            }

            console.log(number);
        });
    };


    //GET STATUS FOR PET
    getStatusForPet(alert) {
      if (alert.get('alertType') == 0) {return {status: 'lost'};}
      if (alert.get('alertType') == 2) {return {status: 'found'};}
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
      var _this = this;
        return object.map(function (alert) {
            return {
                name: alert.get('pet').get('name'),
                user: (alert.get('user')) ? alert.get('user').get('name') : " ",
                breed: alert.get('pet').get('breed'),
                age: alert.get('pet').get('age') ? alert.get('pet').get('age') >= 100 ? Math.round(alert.get('pet').get('age') / 100) + ' years' : alert.get('pet').get('age') + ' months' : '',
                color: alert.get('pet').get('color'),
                status: _this.getStatusForPet(alert).status,
                id: alert.get('pet').id,
                updated: alert.createdAt.toISOString().substring(0, 10)
            }
        });
    };

    render() {
        PubSub.publish('rows', this.getRows());

        return (
            <div>
                <div className="row">
                    <div className="col-md-2">
                        <strong className="total">Total pets: {this.getSize()}</strong>
                    </div>
                </div>
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
