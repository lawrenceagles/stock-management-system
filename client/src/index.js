import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

// Admin imports
import Login from './components/admin/login/Login';
import Dashboard from './components/admin/dashboard/Dashboard.js';
import AuditTrail from './components/admin/audittrail/auditTrail.js';
import onBoard from './components/admin/onboard/onBoard.js';
import Manage from './components/admin/manage/manage.js';
import Settings from './components/admin/settings/settings.js';
import EditCompany from './components/admin/manage/EditCompany.js';
import SchemeMembers from './components/admin/manage/SchemeMembers.js';
import EditUser from './components/admin/manage/EditUser.js';

// user imports
import UserLogin from './components/users/login/Login';
import UserDashboard from './components/users/dashboard/Dashboard.js';
import SchemeRules from './components/users/schemerules/SchemeRules.js';
import Manage from './components/admin/manage/manage.js';
import Usersettings from './components/users/settings/settings.js';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/activity" component={AuditTrail} />
      <Route exact path="/dashboard/onboard" component={onBoard} />
      <Route exact path="/dashboard/manage" component={Manage} />
      <Route exact path="/dashboard/settings" component={Settings} />
      <Route
        exact
        path="/dashboard/manage/company/:id"
        component={EditCompany}
      />
      <Route exact path="/dashboard/manage/user/:id" component={EditUser} />
      <Route
        exact
        path="/dashboard/company/:id/users/"
        component={SchemeMembers}
      />
      <Route exact path="/u/login" component={UserLogin} />
      <Route exact path="/u/dashboard" component={UserDashboard} />
      <Route exact path="/u/dashboard/schemerules" component={SchemeRules} />
      <Route exact path="/u/dashboard/settings" component={UserSettings} />
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
