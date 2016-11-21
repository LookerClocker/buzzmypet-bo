import React from 'react';

const LinkToShelters = (props) => {
    return (
        <a href={'edit_shelters/' + props.dependentValues}><button className="btn btn-default">Edit</button></a>
    )
};

export default LinkToShelters;
