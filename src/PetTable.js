import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import PubSub from 'pubsub-js';
import {Toolbar, Data} from 'react-data-grid/addons';
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

    //GET STATUS FOR PET
    getStatusForPet(pet) {
      console.log('getStatusForPet start for pet = ', pet);
      var _this = this;
      var query = new Parse.Query('Alert');
      //query.equalTo('pet', pet)
      query.find().then(
        (result) => {
          return {status: 0};
          console.log(result);
          for (var i = 0; i < result.length; i++) {
            var alert = result[i];
            console.log('alert = ', alert.get('alertType'));
            if (alert.get('alertType') == 0) {return {status: 0};}
            if (alert.get('alertType') == 2) {return {status: 2};}
            console.log('======');
          }
          return {status: 2}
        }, (error) => {
          console.log('Error getting getStatusForPet');
          console.log(error);
          return {status: 2}
          //_this.forceUpdate()
        }
      )
    };

    getStatusForPet2(pet) {
      return {status: 0};
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
        return object.map(function (pet) {
            return {
                name: pet.get('name'),
                user: (pet.get('user')) ? pet.get('user').get('name') : " ",
                breed: pet.get('breed'),
                age: pet.get('age') ? pet.get('age') >= 100 ? Math.round(pet.get('age') / 100) + ' years' : pet.get('age') + ' months' : '',
                color: pet.get('color'),
                status: _this.getStatusForPet2(pet).status
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
