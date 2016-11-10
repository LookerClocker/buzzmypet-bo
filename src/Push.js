import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField'
import SnackBar from './Snackbar'

var Parse = require('parse').Parse;
var parseApplicationId = 'OeSDM2dUt2TIT97ywwU0gIxUkp9qhXP2wrJgLaXa';
var parseJavaScriptKey = 'o5xVoA2ijwywj1FueOyZuocgMVqzW3Zt73mPA4LX';
var parseMasterKey = 'LLsfJljO4HHCCZktxpgVsCLeF8fQJB1Gw5UqqHjL';

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
        var data = this.props.pointers.map(function (user) {
            return user.id;
        });

        Parse.Cloud.run('SendPush', {pointers: data, message: this.state.message}).then(function (success) {
            snackbar = <SnackBar/>;
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
                    <TextField id="message" style={styles.textFields} value={this.state.message}
                               onChange={e => this.setState({message: e.target.value})}
                    />
                </Dialog>

                {snackbar}

            </div>
        )
    }
}
