import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField'
import SnackBar from './Snackbar'
var Parse = require('parse').Parse;

export default class Push extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: '',
            url: '',
            snackbar: ''
        };
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleSend = () => {
        var _this = this;
        var data = this.props.pointers.map(function (object) {
            return object.userId ? object.userId : object.id; //pets or users
        });

        console.log("handleSend...");
        console.log(data);
        console.log(this.state.message);
        console.log(this.state.url);

        Parse.Cloud.run('SendPush', {pointers: data, message: this.state.message, url: this.state.url}).then(function (success) {
            _this.setState({snackbar: <SnackBar/>});
            console.log(success);
            _this.createEventOnCloudCode(data, _this.state.message, _this.state.url);
        }, function (error) {
            console.log(error);
        });

    };

    //Get All users from cloud code function
    createEventOnCloudCode = (users, message, url)=> {
      var _this = this;
      console.log("createEventOnCloudCode...");
      console.log(users);
      console.log("message: ", message);
      console.log("urlL: ", url);


      Parse.Cloud.run('CreateEvent', {
        eventType: 4,
        users: users,
        pushMessage: message,
        pushURL: url
      }).then(function (success) {
          console.log(success);
      }, function (error) {
          console.log(error);
      });

      
      this.setState({
          message: '',
          url: '',
          open: false,
          snackbar: ''
      });
    };


    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const styles = {
            title: {
                cursor: 'pointer',
                color: '#fff'
            },
            textFields: {
                width: '100%'
            }
        };

        var pushButton = (this.props.path === 'users' || this.props.path === 'pets') ?
            <FlatButton label="Push" style={styles.title} onTouchTap={this.handleOpen}/> : '';

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleSend}
            />
        ];
        return (
            <div>
                {pushButton}
                <Dialog
                    title="Enter a message which will send for users"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <TextField
                        hintText="Message"
                        floatingLabelText="Type message"
                        id="message"
                        style={styles.textFields} value={this.state.message}
                        onChange={e => this.setState({message: e.target.value})}
                    />
                    <TextField
                        hintText="url"
                        floatingLabelText="Type url"
                        id="url"
                        value={this.state.url}
                        onChange={e => this.setState({url: e.target.value})}
                    />
                </Dialog>

                {this.state.snackbar}

            </div>
        )
    }
}
