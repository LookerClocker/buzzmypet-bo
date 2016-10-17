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
        key: 'user',
        name: 'User',
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

    getPets(callback) {
        var _this = this;

        var query = new Parse.Query('Pet');
        query.limit(10000);
        query.include('user');
        query.find({
            success: function (pets) {
                _this.setState({
                    petsList: pets.map(function (pet) {
                        return {
                            name: pet.get('name'),
                            user: (pet.get('user')) ? pet.get('user').get('name') : "no name"
                        }
                    }),
                    rows: pets.map(function (pet) {
                        return {
                            name: pet.get('name'),
                            user: (pet.get('user')) ? pet.get('user').get('name') : "no name"
                        }
                    })
                });
                callback(pets);
            },
            error: function (error) {
                console.error('getPets() error', error);
                callback(null, error);
            }
        });
    };

    toCSV = ()=> {
        var fields = ['name', 'user'];
        var dataToCsv = this.state.rows.map(function (pet) {
            return {
                name: pet.name,
                user: (pet.user) ? pet.user : "no name"
            }
        });

        const filename = 'Pets.csv';
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
                    onClearFilters={this.onClearFilters}/>
            </div>
        )
    };
};