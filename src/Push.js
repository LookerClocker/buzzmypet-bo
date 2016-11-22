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
        var data = this.props.pointers.map(function (user) {
            return user.id;
        });

        Parse.Cloud.run('SendPush', {pointers: data, message: this.state.message, url: this.state.url}).then(function (success) {
            _this.setState({snackbar: <SnackBar/>});
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

        var pushButton = (this.props.path === 'users') ?
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
