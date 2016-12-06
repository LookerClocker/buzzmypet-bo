import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import PubSub from 'pubsub-js';
import {Toolbar, Data} from 'react-data-grid/addons';
var Selectors = Data.Selectors;
var Parse = require('parse').Parse;
var _ = require('underscore');
var Loader = require('react-loader');

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
            nextRows: [],
            loaded: false
        };
    };

    componentDidMount() {
        var _this = this;

        //this.getPetsFromCloudCode();
        this.getAllPetsFromCloudCode();

        // this.getPetsFromAlerts(function (items) {
        //     _this.setState({
        //         petsList: items,
        //         rows: this.state.petsList
        //     });
        // });
    };


    componentWillUnmount() {
      this.setState({loaded: true});
    };

    //Get PEts from Alerts Collection from cloud code function
    getPetsFromCloudCode = (allPets)=> {
      var _this = this;
      Parse.Cloud.run('retrieveAllObjects', {
        object_type: "Alert", // REQUIRED - string: name of your Parse class
        include: ['pet', 'user'],
        exists: "pet",
        //update_at: moment().toDate(), // OPTIONAL - JS Date object: Only retrieve objects where update_at is higher than...
        //only_objectId: true|false // OPTIONAL - boolean: the result will only be composed by objectId + date fields, otherwise all attributes are returned.
      }).then(function(pets) {

        var sorted = pets.sort(function(a, b) {
          if(a.get('pet').id < b.get('pet').id) return -1;
          if(a.get('pet').id > b.get('pet').id) return 1;
          return 0;
        });

        var reversed = sorted.reverse();
        var unique = _.unique(reversed,function(d){ return d.get('pet').id});
        var final = unique.reverse();
        var allObj=[];
        allObj = allObj.concat(_this.fullFill(final));

        var allPetsTemp = allPets;
        var clones = 0;
        for(var i=0; i< allPets.length; i++) {
          for(var j=0; j< allObj.length; j++) {
            if(allPets[i].id  == allObj[j].id) {
              allPetsTemp.splice(i, 1);
              clones++;
            }
          }
        }

        var concatPets = allPetsTemp.concat(allObj)


        var sortedConcatedPets = concatPets.sort(function(a, b) {
          if(a.updated < b.updated) return 1;
          if(a.updated > b.updated) return -1;
          return 0;
        });


        _this.setState({
          petsList: sortedConcatedPets,
          rows: sortedConcatedPets,
          loaded: true

        });

      });
    };


    //Get All pets from PEts Collection from cloud code function
    getAllPetsFromCloudCode = ()=> {
      var _this = this;
      Parse.Cloud.run('retrieveAllObjects', {
        object_type: 'Pet', // REQUIRED - string: name of your Parse class
        include: ['user']
        //update_at: moment().toDate(), // OPTIONAL - JS Date object: Only retrieve objects where update_at is higher than...
        //only_objectId: true|false // OPTIONAL - boolean: the result will only be composed by objectId + date fields, otherwise all attributes are returned.
      }).then(function(allPets) {
        var allObj=[];
        allObj = allObj.concat(_this.fullFillAllPets(allPets));

        _this.getPetsFromCloudCode(allObj)
      });
    };


    // // GET PETS FROM PARSE.COM
    // getPets(callback) {
    //     var _this = this;
    //     var query = new Parse.Query('Pet');
    //     query.count().then(function (number) {
    //         query.limit(1000);
    //         query.skip(0);
    //         query.addAscending('createdAt');
    //         var allObj=[];
    //         query.include('user');
    //
    //         for(var i=0; i<=number; i+=1000) {
    //             query.skip(i);
    //             query.find().then(function (pets) {
    //                 allObj = allObj.concat(_this.fullFill(pets));
    //                 _this.setState({
    //                     petsList: allObj,
    //                     rows: allObj
    //                 });
    //
    //                 callback(pets);
    //             });
    //         }
    //
    //         console.log(number);
    //     });
    // };

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

    // FULLFILL Alerts) ARRAY
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
                userId: alert.get('user')? alert.get('user').id : "",
                updated: alert.createdAt.toISOString().substring(0, 10)
            }
        });
    };

    // FULLFILL Alerts) ARRAY
    fullFillAllPets = (object)=> {
      var _this = this;
        return object.map(function (pet) {
            return {
                name: pet.get('name'),
                user: (pet.get('user')) ? pet.get('user').get('name') : " ",
                breed: pet.get('breed'),
                age: pet.get('age') ? pet.get('age') >= 100 ? Math.round(pet.get('age') / 100) + ' years' : pet.get('age') + ' months' : '',
                color: pet.get('color'),
                status: "new",
                id: pet.id,
                userId: pet.get('user')? pet.get('user').id : "",
                updated: pet.createdAt.toISOString().substring(0, 10)
            }
        });
    };

    render() {
        PubSub.publish('rows', this.getRows());

        return (
            <div>
            <Loader loaded={this.state.loaded}>

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
            </Loader>
            </div>
        )
    };
};
