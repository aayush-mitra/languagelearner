import React, { Component } from 'react'
import { MyContext } from '../storage';
import {Link, Redirect} from 'react-router-dom'

import {register, login} from '../utils/authfuncs';
import { setInStorage } from '../utils/storage.js';


export class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      register: this.props.register,
      name: '',
      email: '',
      password: '',
      redirect: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmit(e) {
    const {
      name,
      email,
      password
    } = this.state;
    e.preventDefault();
    if (this.state.register) {
      const newUser = {
        name,
        email,
        password
      };
      //console.log(newUser)
      register(this.context.state.proxy, newUser, (data) => {
        //console.log(data);
        login(this.context.state.proxy, newUser, (data2) => {
          //console.log(data2);
          const {
            email,
            name,
            lists,
            _id
          } = data.user
          this.context.setUserData({
            email,
            name,
            lists,
            _id
          });

          setInStorage('LanguageLearner', {token: data2.token});
          this.setState({
            name: '',
            email: '',
            password: '',
            redirect: true
          });
          this.context.changeToken(data2.token);
          this.props.changeToken(data2.token);
        })
      })
      
    } else {
      const info = {
        email,
        password
      };
      login(this.context.state.proxy, info, (data2) => {
        //console.log(data2);
        const {
          email,
          name,
          lists,
          _id
        } = data2.user
        this.context.setUserData({
          email,
          name,
          lists,
          _id
        });

        setInStorage('LanguageLearner', {token: data2.token});
        this.setState({
          name: '',
          email: '',
          password: '',
          redirect: true
        });
        this.context.changeToken(data2.token);
        this.props.changeToken(data2.token);
      })

      

      //console.log(info);
    }
  }

  render() {
    let label_classes = {
      label1: this.state.register ? 'label1' : 'label1 auth-selected',
      label2: !this.state.register ? 'label2' : 'label2 auth-selected',
      buttontxt: this.state.register ? 'Register' : 'Login'
    };

    if (this.state.redirect) {
      return (<Redirect to="/" />)
    }


    return (
      <div className="body">
        <div className="navbar">
          <div className="container flex">
            <h1 className="logo">Language Learner</h1>
            <nav>
              <ul>
                <li>
                  <Link className="link" to="/">Home</Link>
                </li>
                
              </ul>
            </nav>
          </div>
        </div>

        <div className="main">
          <div className="auth-wrapper stuff">
            
            <div className="auth">
              <div className={label_classes.label1} onClick={() => this.setState({register: false})}>Login</div>
              <div className={label_classes.label2} onClick={() => this.setState({register: true})}>Register</div>
              <div className="infoarea auth-selected">
                {
                  this.state.register ? <div>
                    <label>Name: </label><br />
                    <input type="text" onChange={this.onChange} value={this.state.name} className="editinput" name="name" />
                  </div> : null
                }
                
                <div>
                  <label>Email: </label><br />
                  <input type="email" onChange={this.onChange} value={this.state.email} className="editinput" name="email" />
                </div>
                <div>
                  <label>Password: </label><br />
                  <input type="password" onChange={this.onChange} value={this.state.password} className="editinput" name="password" />
                </div>
                <div>
                  <button onClick={this.onSubmit}>{label_classes.buttontxt}</button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    )
  }
}

export default Auth
Auth.contextType = MyContext;