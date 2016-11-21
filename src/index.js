import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Users from './UserTable';
import Pets from './PetTable'
import Shelters from './Shelters'
import NewShelter from './AddShelter'
import Router from 'react-router/lib/Router';
import { browserHistory, IndexRedirect } from 'react-router';
import Route from 'react-router/lib/Route';

ReactDOM.render(
    <Router history={ browserHistory }>
        <Route path='/' component={ App }>
            <IndexRedirect to="pets"/>
            <Route path='users' component={ Users }/>
            <Route path='pets' component={ Pets }/>
            <Route path='shelters' component={ Shelters }/>
            <Route path='new_shelter' component={ NewShelter }/>
            <Route path='edit_shelters/:id' component={ NewShelter }/>
        </Route>

    </Router>,
    document.getElementById('root')
);
