import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router'

export default class AddShelterConfirm extends Component {
    state = {
        open: true,
    };

    handleClose = () => {
        this.setState({open: false});
        window.location ='/shelters'
    };

    render() {
        const actions = [
                <FlatButton
                    label="OK"
                    primary={true}
                    keyboardFocused={true}
                    onTouchTap={this.handleClose}
                />,
        ];

        return (
            <div>
                <Dialog
                    title="Success"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    The new shelter has been added successfully!
                </Dialog>
            </div>
        );
    }
}