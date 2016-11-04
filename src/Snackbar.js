import React from 'react';
import Snackbar from 'material-ui/Snackbar';

export default class SnackbarExampleSimple extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true
        };
    }

    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        return (
            <div>
                <Snackbar
                    open={this.state.open}
                    message="Push message was sent!"
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        );
    }
}
