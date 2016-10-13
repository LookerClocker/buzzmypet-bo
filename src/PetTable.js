import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import Json2csv from 'json2csv';

var Parse = require('parse').Parse;

var parseApplicationId = 'KzykKl3uejlA8eNvij0wbc45SS6XaZPqZM3FsIeV';
var parseJavaScriptKey = 'mplYkntmCwoNEhmH2uuuRPeRosulwSJwxtOqs1gh';
var parseMasterKey = 'r0J0D2CYbm6Gkilx2IdWO4tOGO2MrVe3SHVjD401';

Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

var columns = [
    {
        key: 'name',
        name: 'Name',
    },
    {
        key: 'user',
        name: 'User',
    }
];

export default class PetsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            petsList: []
        };

        this.rowGetter = this.rowGetter.bind(this);
        this.toCSV = this.toCSV.bind(this);
    };

    componentDidMount() {
        var _this = this;

        this.getPets(function (items) {
            console.log('This is items-> ', items);
            _this.setState({
                petsList: items
            });
        });
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

    rowGetter(i) {
        return this.state.petsList[i];
    };

    toCSV() {
        var fields = ['name', 'user'];
        var dataToCsv = this.state.petsList.map(function (pet) {
            return {
                name: pet.get('name'),
                user: (pet.get('user')) ? pet.get('user').get('name') : "no name"
            }
        });

        const filename = 'Pets.csv';
        const csv = Json2csv({data: dataToCsv, fields: fields});

        var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        if (navigator.msSaveBlob) { // IE 10+
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
    }

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
                    dataSource={this.state.petsList}
                    columns={columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.petsList.length}
                    minHeight={400}/>
            </div>

        )
    };
};