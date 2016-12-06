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
var Parse = require('parse').Parse;

//Prod
// var parseApplicationId = 'OeSDM2dUt2TIT97ywwU0gIxUkp9qhXP2wrJgLaXa';
// var parseJavaScriptKey = 'o5xVoA2ijwywj1FueOyZuocgMVqzW3Zt73mPA4LX';
// var parseMasterKey = 'LLsfJljO4HHCCZktxpgVsCLeF8fQJB1Gw5UqqHjL';

//Dev
var parseApplicationId = 'KzykKl3uejlA8eNvij0wbc45SS6XaZPqZM3FsIeV';
var parseJavaScriptKey = 'mplYkntmCwoNEhmH2uuuRPeRosulwSJwxtOqs1gh';
var parseMasterKey = 'hv8mOoehw2sQaO20jwvdT6CJLKTDgKuoRpXVOCzF';

Parse.initialize(parseApplicationId, parseJavaScriptKey, parseMasterKey);

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
