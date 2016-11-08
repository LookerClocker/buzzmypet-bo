import React, { Component } from 'react';
// import Json2csv from 'json2csv';
import FlatButton from 'material-ui/FlatButton';

import PubSub from 'pubsub-js';

export default class ExportToCSV extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: [],
        };
    };

    componentDidMount() {
        this.token = PubSub.subscribe('rows', this.subscriberRows);
    };
    componentWillUnmount() {
        PubSub.unsubscribe(this.token)
    };

    subscriberRows =(msg, data) => {
        this.setState({
            rows: data
        });
    };

    toCSV = ()=> {
    //     var fields = Object.keys(this.state.rows[0]);
    //
    //     const filename = this.props.path + '.csv';
    //     const csv = Json2csv({data: this.state.rows, fields: fields});
    //
    //     var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    //     if (navigator.msSaveBlob) {
    //         navigator.msSaveBlob(blob, filename);
    //     }
    //     else {
    //         var link = document.createElement('a');
    //         if (link.download !== undefined) {
    //             var url = URL.createObjectURL(blob);
    //             link.setAttribute('href', url);
    //             link.setAttribute('download', filename);
    //             link.style.visibility = 'hidden';
    //             document.body.appendChild(link);
    //             link.click();
    //             document.body.removeChild(link);
    //         }
    //     }
    //     this.setState({
    //         rows: []
    //     })
    };

    render() {
        const styles = {
            title: {
                position:'relative',
                top: '8px',
                cursor: 'pointer',
                color: '#fff'
            },
        };
        return (
            <div>
                <FlatButton style={styles.title} label='download CSV' onClick={this.toCSV}/>
            </div>
        )
    }

}