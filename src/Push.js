import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField'
import SnackBar from './Snackbar'

var Parse = require('parse').Parse;
var parseApplicationId = 'KzykKl3uejlA8eNvij0wbc45SS6XaZPqZM3FsIeV';
var parseJavaScriptKey = 'mplYkntmCwoNEhmH2uuuRPeRosulwSJwxtOqs1gh';
var parseMasterKey = 'r0J0D2CYbm6Gkilx2IdWO4tOGO2MrVe3SHVjD401';

Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

var snackbar = '';

export default class Push extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: ''
        };
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleSend = () => {
        var data = this.props.pointers.map(function(user){
            return user.id;
        });

        Parse.Cloud.run('SendPush', {pointers: data, message: this.state.message}).then(function(success){
            snackbar =  <SnackBar/>;
            console.log(success);
        }, function (error) {
            console.log(error);
        });

        this.setState({
            message: '',
            open: false
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

        // var pushButton = (this.props.path === 'users') ?
        //     <FlatButton label="Push" style={styles.title} onTouchTap={this.handleOpen}/> : '';

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
                <FlatButton label="Push" style={styles.title} onTouchTap={this.handleOpen}/>
                <Dialog
                    title="Enter a message which will send for users"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <TextField id="message" style={styles.textFields} value={this.state.message}
                               onChange={e => this.setState({message: e.target.value})}
                    />
                </Dialog>
                {snackbar}
            </div>
        )
    }
}
