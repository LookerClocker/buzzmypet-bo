import React, {Component} from 'react';
import ReactDataGrid from 'react-data-grid';
import Json2csv from 'json2csv';

// var Parse = require('parse').Parse;
//
// var parseApplicationId = 'KzykKl3uejlA8eNvij0wbc45SS6XaZPqZM3FsIeV';
// var parseJavaScriptKey = 'mplYkntmCwoNEhmH2uuuRPeRosulwSJwxtOqs1gh';
// var parseMasterKey = 'r0J0D2CYbm6Gkilx2IdWO4tOGO2MrVe3SHVjD401';
//
// Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

var columns = [
    {
        key: 'name',
        name: 'NAME',
    }
];

export default class UserTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:this.props.userList
        };

        this.rowGetter = this.rowGetter.bind(this);
        this.toCSV = this.toCSV.bind(this);
    };

    rowGetter(i) {
        return this.state.user[i];
    };

    toCSV() {
        var fields = ['id', 'name', 'email'];
        var dataToCsv = this.state.user;

        const filename = 'Users.csv';
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
                <p>jhkj jkjkhkjhk</p>
                <button
                    className="col-md-offset-10 btn btn-success"
                    onClick={this.toCSV}>
                    to csv
                </button>
                <ReactDataGrid
                    idProperty="id"
                    dataSource={this.state.user}
                    columns={columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.user.length}
                    minHeight={400}/>
            </div>

        )
    };
};

UserTable.propTypes = {
    userList: React.PropTypes.array.isRequired
};