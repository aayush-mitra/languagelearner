import React, { Component } from 'react'

export class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      userData: {},
      proxy: 'https://language-learner-am.herokuapp.com/api/',
      proxy2: 'https://language-learner-am.herokuapp.com/api/'
    };
  }

  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        changeToken: (token) => this.setState({ token: token }),
        setUserData: (data) => this.setState({ userData: data })
      }}>
        {this.props.children}
      </MyContext.Provider>
    )
  }
}

export default MyProvider;
export const MyContext = React.createContext();
