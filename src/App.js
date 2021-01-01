import React, { Component } from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import Home from './components/Home';
import Auth from './components/Auth';
import List from './components/List';

import { MyContext } from './storage'
import {
  getFromStorage
} from './utils/storage';

import './App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      error: '',
      token: this.props.token
    };

    this.setParentToken = this.setParentToken.bind(this);
  }

  setParentToken(t) {
    this.setState({ token: t });
  }

  componentDidMount() {
    const obj = getFromStorage('LanguageLearner');
    if (obj && obj.token) {
      fetch(`${this.context.state.proxy}users/verify?token=${obj.token}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.context.changeToken(obj.token);
            this.context.setUserData(json.user);
            //console.log(this.context.state.userData);
            this.setState({
              token: obj.token,
              isLoading: false
            })
          } else {
            this.setState({
              isLoading: false
            });
          }
        })
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div><p>Loading...</p></div>
      )
    }
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path="/" exact strict render={
            () => (
              <React.Fragment>
                {
                  this.state.token !== '' ? (<MyContext.Consumer>
                    {(context) => (
                      <Home setParentToken={this.setParentToken} token={context.state.token} />
                    )}
                  </MyContext.Consumer>) : <Redirect to="/auth" />
                }
              </React.Fragment>
            )
          } />

          <Route path="/auth" exact strict render={
            () => (

              <React.Fragment>
                {
                  this.state.token === '' ? <Auth changeToken={(token) => this.setState({ token: token })} register={false} />
                    : <Redirect to="/" />
                }
              </React.Fragment>
            )
          } />

          <Route path="/list/:id" exact strict component={
            (props) => (

              this.state.token !== '' ? <List userData={this.context.state.userData} setParentToken={this.setParentToken} {...props} />
                : <Redirect to="/auth" />
            )
          } />
        </Switch>
      </Router>
    )
  }
}

export default App;
App.contextType = MyContext