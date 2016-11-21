import React, {Component} from 'react';
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
            title: '',
            phone: '',
            address: '',
            city: '',
            email: '',
            latitude: '',
            longitude: '',
            sentShelter: false,
            buttTitle: 'Add shelter',
            message: 'The new shelter has been added successfully!'
        }
    }

    componentDidMount() {
        var _this = this;
        if (this.props.params.id) {
            this.getShelter(function (item) {
                _this.setState({
                    message: 'Shelter has been updated successfully!',
                    buttTitle: 'Save changes',
                    title: item.get('title'),
                    phone: item.get('phone'),
                    address: item.get('address'),
                    city: item.get('city'),
                    email: item.get('email'),
                    latitude: item.get('location')._latitude.toString(),
                    longitude: item.get('location').longitude.toString(),
                })
            });
        }
    };

    // update shelters
    getShelter = (callback)=> {
        var query = new Parse.Query('Shelter');
        query.limit(1000);
        query.equalTo('objectId', this.props.params.id);
        query.first({
            success: function (item) {
                callback(item);
            },
            error: function (error) {
                console.error('getShelters() error', error);
                callback(null, error);
            }
        });
    };

    updateShelter = () => {
        var _this = this;
        var query = new Parse.Query('Shelter');
        query.equalTo("objectId", this.props.params.id);
        var location = new Parse.GeoPoint({
            latitude: parseFloat(this.state.latitude),
            longitude: parseFloat(this.state.longitude)
        });
        query.first({
            success: function (Shelter) {
                Shelter.save(null, {
                    success: function (shelter) {
                        shelter.set('title', _this.state.title);
                        shelter.set('phone', _this.state.phone);
                        shelter.set('address', _this.state.address);
                        shelter.set('city', _this.state.city);
                        shelter.set('email', _this.state.email);
                        shelter.set('location', location);
                        shelter.save(null, {success: function () {
                            _this.setState({
                                sentShelter: true
                            });
                        },})
                    }
                });
            }
        });
    };

    // add shelters
    addShelter = ()=> {
        if (this.props.params.id) {
            this.updateShelter();
        } else {
            var _this = this;
            var location = new Parse.GeoPoint({
                latitude: parseFloat(this.state.latitude),
                longitude: parseFloat(this.state.longitude)
            });
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
                success: function () {
                    _this.setState({
                        sentShelter: true
                    });
                },

            }, {
                error: function (error) {
                    console.log(error);
                }
            });

        }

    };


    render() {

        if (this.state.sentShelter) {
            var shelterConfirm = <ShelterConfirm message={this.state.message}/>
        }
        return (
            <div className="container-fluid">
                {shelterConfirm}
                <div className="main-div">
                    <div className="row">
                        <div className="col-md-4">
                            <label for="title">Title</label>
                            <input
                                id="title"
                                className="form-control inp-margin"
                                type="text"
                                value={this.state.title}
                                onChange={e=> this.setState({title: e.target.value})}>
                            </input>
                        </div>
                        <div className="col-md-4">
                            <label for="phone">Phone</label>
                            <input
                                id="phone"
                                className="form-control inp-margin"
                                type="text"
                                value={this.state.phone}
                                onChange={e=> this.setState({phone: e.target.value})}>
                            </input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <label for="phone">Address</label>
                            <input
                                id="address"
                                className="form-control inp-margin"
                                type="text"
                                value={this.state.address}
                                onChange={e=> this.setState({address: e.target.value})}>
                            </input>
                        </div>
                        <div className="col-md-4">
                            <label for="city">City</label>
                            <input
                                id="city"
                                className="form-control inp-margin"
                                type="text"
                                value={this.state.city}
                                onChange={e=> this.setState({city: e.target.value})}>
                            </input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <label for="phone">Latitude</label>
                            <input
                                id="lat"
                                className="form-control inp-margin"
                                type="text"
                                value={this.state.latitude}
                                onChange={e=> this.setState({latitude: e.target.value})}>
                            </input>
                        </div>
                        <div className="col-md-4">
                            <label for="long">Longitude</label>
                            <input
                                id="long"
                                className="form-control inp-margin"
                                type="text"
                                value={this.state.longitude}
                                onChange={e=> this.setState({longitude: e.target.value})}>
                            </input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <label for="email">Email</label>
                            <input
                                id="email"
                                className="form-control inp-margin"
                                type="text"
                                value={this.state.email}
                                onChange={e=> this.setState({email: e.target.value})}>
                            </input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <button onClick={this.addShelter}
                                    className="btn btn-default">{this.state.buttTitle}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};