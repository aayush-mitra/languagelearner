import React, { Component } from 'react'

import {Link} from 'react-router-dom'
import {MyContext} from '../storage'
import { getFromStorage } from '../utils/storage';

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: '',
      new: false
    };

    this.onChange = this.onChange.bind(this);
    this.onNew = this.onNew.bind(this);
    this.create = this.create.bind(this);
    this.logout = this.logout.bind(this);
  }

  logout(e) {
    e.preventDefault();
    const obj = getFromStorage('LanguageLearner');

    if (obj && obj.token) {
      fetch(this.context.state.proxy + 'users/logout?token=' + obj.token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.props.setParentToken('');
            this.context.changeToken('');
            this.context.setUserData({});
          } else {
            //console.log(json.message);
          }
        })
    } else {
      //console.log('err');
    }
  }

  onChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  onNew(e) {
    e.preventDefault();
    this.setState({
      new: true
    });
  }

  create(e) {
    e.preventDefault();
    const stuff = {
      name: this.state.list,
      userid: this.context.state.userData._id
    };
    //console.log(stuff)
    fetch(this.context.state.proxy+'lists/create', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(stuff)
    }).then(res => res.json())
      .then(json => {
        const {
          email,
          name,
          lists,
          _id
        } = json.user
        this.context.setUserData({
          email,
          name,
          lists,
          _id
        });     
        this.setState({
          list: '',
          new: false
        });
        
      })
  }

  render() {
    const the_list = this.context.state.userData.lists.map((elem, i) => {
      return (
      <Link key={i} className="link" to={'/list/'+elem._id}>
        <li>{elem.name}</li>
      </Link>
      )
    });
    

    //console.log(the_list)

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
                <li>
                  <a href="#" className="link" onClick={this.logout}>Logout</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="main">
          <div className="flex stuff">
            <div className="listnav">
              <h2>My Lists</h2>
              <nav>
                <ul>
                  {the_list}
                  {this.state.new ?
                    <li>
                      <input type="text" onChange={this.onChange} value={this.state.list} className="editinput" name="list" />
                    </li> : null
                  }
                  {!this.state.new ?
                    <li>
                      <button onClick={this.onNew} className="new">New +</button>
                    </li> :
                    <li>
                      <button onClick={this.create} className="new">Create</button>
                    </li>
                  }
                </ul>
              </nav>
            </div>
            <div className="showcase">
              <div className="display">
                <p>Select the list that you would like to view.</p>
              </div>
            </div>
            <div className="actionnav">
              <h2>View</h2>
              <nav>
                <ul>
                  <li>Select a list<br />to select a view.</li>
                  
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
Home.contextType = MyContext;
