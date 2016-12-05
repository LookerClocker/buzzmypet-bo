import React from 'react';

var LinkToDelete = React.createClass({

  deleteShelter(e) {
    console.log("Inside child cimponent");
      e.preventDefault();
      console.log(this.props.dependentValues.id);
      this.props.dependentValues.delete(this.props.dependentValues.id);
  },

  render() {
      return (
          <div className="btn-toolbar">
              <button className="btn btn-default" onClick={this.deleteShelter}>Delete</button>
          </div>
        );
    }


});

//export default LinkToDelete;
module.exports = LinkToDelete;
