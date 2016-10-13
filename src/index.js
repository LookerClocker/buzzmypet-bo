import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Users from './UserTable';
import Pets from './PetTable'
import history from 'react-router/lib/hashHistory';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';

ReactDOM.render(
    <Router history={ history }>
        <Route path='/' component={ App }>
            <Route path='users' component={ Users }/>
            <Route path='pets' component={ Pets }/>
        </Route>
    </Router>,
    document.getElementById('root')
);
