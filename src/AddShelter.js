import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
var Parse = require('parse').Parse;
var parseApplicationId = 'OeSDM2dUt2TIT97ywwU0gIxUkp9qhXP2wrJgLaXa';
var parseJavaScriptKey = 'o5xVoA2ijwywj1FueOyZuocgMVqzW3Zt73mPA4LX';
var parseMasterKey = 'LLsfJljO4HHCCZktxpgVsCLeF8fQJB1Gw5UqqHjL';

import ShelterConfirm from './SuccessDialog'

Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

export default class AddShelter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:'',
            phone:'',
            address:'',
            city:'',
            email:'',
            latitude:'',
            longitude:'',
            sentShelter: false
        }
    }

    componentDidMount() {

    };

    addShelter = ()=> {
        var _this = this;
        var location = new Parse.GeoPoint({latitude: parseFloat(this.state.latitude), longitude: parseFloat(this.state.longitude)});
        var ShelterClass = Parse.Object.extend('Shelter');
        var shelter = new ShelterClass();

        shelter.set('title', this.state.title);
        shelter.set('phone', this.state.phone);
        shelter.set('address', this.state.address);
        shelter.set('city', this.state.city);
        shelter.set('email', this.state.email);
        shelter.set('location', location);

        // save and send data to Parse
        shelter.save(null, {
            success: function (shelter) {
                _this.setState({
                    sentShelter: true
                });
                console.log('shelter HAS SENT->', shelter);
            },

        }, {
            error: function (error) {
                console.log(error);
            }
        });

    };

    render() {

        if (this.state.sentShelter) {
            var shelterConfirm = <ShelterConfirm/>
        }

        return (
            <div className="container-fluid">
                {shelterConfirm}
                <div className="row">
                    <div className="col-md-6">
                        <TextField
                            ref='title'
                            hintText="title"
                            floatingLabelText="Title"
                            value={this.state.title}
                            onChange={e=> this.setState({title: e.target.value})}>
                            <input type="text"/>
                        </TextField>
                    </div>
                    <div className="col-md-6">
                        <TextField
                            ref='phone'
                            hintText="phone"
                            floatingLabelText="Phone"
                            value={this.state.phone}
                            onChange={e=> this.setState({phone: e.target.value})}>
                            <input type="text"/>
                        </TextField>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <TextField
                            ref='address'
                            hintText="address"
                            floatingLabelText="Address"
                            value={this.state.address}
                            onChange={e=> this.setState({address: e.target.value})}>
                            <input type="text"/>
                        </TextField>
                    </div>
                    <div className="col-md-6">
                        <TextField
                            ref='city'
                            hintText="city"
                            floatingLabelText="City"
                            value={this.state.city}
                            onChange={e=> this.setState({city: e.target.value})}>
                            <input type="text"/>
                        </TextField>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <TextField
                            ref='latitude'
                            hintText="latitude"
                            floatingLabelText="Latitude"
                            value={this.state.latitude}
                            onChange={e=> this.setState({latitude: e.target.value})}>
                            <input type="text"/>
                        </TextField>
                    </div>
                    <div className="col-md-6">
                        <TextField
                            ref='longitude'
                            hintText="longitude"
                            floatingLabelText="Longitude"
                            value={this.state.longitude}
                            onChange={e=> this.setState({longitude: e.target.value})}>
                            <input type="text"/>
                        </TextField>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <TextField
                            ref='email'
                            hintText="email"
                            floatingLabelText="Email"
                            value={this.state.email}
                            onChange={e=> this.setState({email: e.target.value})}>
                            <input type="text"/>
                        </TextField>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12"><button onClick={this.addShelter} className="btn btn-default">Add</button></div>
                </div>
            </div>
        )
    }
}