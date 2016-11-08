import React from 'react';

import Users from './UserTable';
import Pets from './PetTable';
import { browserHistory } from 'react-router';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';

export default (
    <Router history={browserHistory}>
        <Route path='/' component={ Pets }>
            <Route path='users' component={ Users }/>
            <Route path='pets' component={ Pets }/>
        </Route>
    </Router>
);