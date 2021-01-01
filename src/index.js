import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import MyProvider from './storage';
import { MyContext } from './storage';
import reportWebVitals from './reportWebVitals';

const thing = (
  <MyProvider>
    <MyContext.Consumer>
      {(context) =>
        <App token={context.state.token} />}
    </MyContext.Consumer>
  </MyProvider>
);

ReactDOM.render(thing, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
