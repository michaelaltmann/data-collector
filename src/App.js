import './App.css';
import Observation from './Observation'
import Study from './Study'
import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import aws_exports from './aws-exports';
import Auth from 'aws-amplify';
import NavBar from './NavBar'
import { withAuthenticator } from '@aws-amplify/ui-react';

Auth.configure(aws_exports);

class App extends Component {
  render() {
    return (
      <div>
        <Router >
          <div>
            <NavBar />
            <Switch>
              <Route path="/study" component={Study} />
              <Route path="/observation" component={Observation} />
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}

export default withAuthenticator(App);
