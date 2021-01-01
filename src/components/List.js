import React, { Component } from 'react'

import { Link, Redirect } from 'react-router-dom'
import { MyContext } from '../storage'
import { getFromStorage } from '../utils/storage'
import { Flashcards } from './Flashcards';
import { Quiz } from './Quiz';

export class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      view: 'edit',
      listid: this.props.match.params.id,
      user: this.props.userData,
      list: {},
      new: false,
      create1: '',
      create2: '',
      redirect: false,
      save: false
    };
    this.logout = this.logout.bind(this);
    this.changeView = this.changeView.bind(this);
    this.editOnChange = this.editOnChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.toggleCreate = this.toggleCreate.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.createOnChange = this.createOnChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.deleteList = this.deleteList.bind(this);
  }

  deleteList(e) {
    e.preventDefault();
    let final = {
      userid: this.state.user._id,
      listid: this.state.listid
    }
    e.target.innerHTML = 'Deleting...'
    fetch(`${this.context.state.proxy}lists/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(final)
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          //console.log(json.user);
          
          this.context.setUserData(json.user);

        }
      })
  }

  onDelete(e) {
    e.preventDefault();
    let data = this.state.list.cards[parseInt(e.target.name)];
    //console.log(data)
    let final = {
      cardid: data._id,
      listid: this.state.listid
    }
    e.target.innerHTML = 'Deleting...'
    fetch(`${this.context.state.proxy}lists/delete-card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(final)
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          let contextstuff = this.context.state.userData;
          contextstuff.lists = json.lists;
          this.context.setUserData(contextstuff);

        }
      })
  }

  createOnChange(e) {
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
  }

  onCreate(e) {
    e.preventDefault();
    let final = {
      side1: this.state.create1,
      side2: this.state.create2,
      userid: this.state.user._id,
      listid: this.state.listid
    }
    e.target.innerHTML = 'Creating...'
    fetch(`${this.context.state.proxy}lists/create-card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(final)
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          let contextstuff = this.context.state.userData;
          contextstuff.lists = json.lists;
          
          this.context.setUserData(contextstuff);

        }
      })
  }

  toggleCreate(e) {
    e.preventDefault();
    this.setState({ new: true });
  }

  changeView(e) {
    //console.log(e.target.innerHTML.toLowerCase());
    this.setState({
      view: e.target.innerHTML.toLowerCase()
    });
  }

  editOnChange(e) {
    let prev = this.state.list
    prev.cards[parseInt(e.target.name.split(",")[1])][e.target.name.split(",")[0]] = e.target.value;
    this.setState({
      list: prev,
      save: true
    });
  }

  onSave(e) {
    e.preventDefault();
    //console.log(e)
    let final = {
      the_list: this.state.list,
      listid: this.state.listid
    }
    e.target.innerHTML = 'Saving...'
    fetch(`${this.context.state.proxy}lists/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(final)
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          let contextstuff = this.context.state.userData;
          contextstuff.lists = json.lists;
          this.context.setUserData(contextstuff);

        }
      })
  }

  logout(e) {
    e.preventDefault();
    const obj = getFromStorage('LanguageLearner');

    if (obj && obj.token) {
      fetch(this.context.state.proxy + 'users/logout')
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

  static getDerivedStateFromProps(nextProps, prevState) {

    if (nextProps.match.params.id !== prevState.listid) {

      return ({ listid: nextProps.match.params.id })
    } else {
      return null
    }

  }

  componentDidMount() {
    let main;
    main = this.state.user.lists;
    if (this.state.user.lists.map(e => e._id).includes(this.state.listid)) {
      main.forEach((elem) => {
        if (elem._id === this.state.listid) {
          this.setState({
            list: elem,
            isLoading: false
          });
        }
      });
    } else {
      this.setState({
        redirect: true,
        isLoading: false
      });
    }
  }
  render() {
    
    if (this.state.isLoading) {
      
      return (<p>Loading...</p>)
    }

    if (this.state.redirect === true) {
      return (<Redirect to="/" />)
    }
    //console.log(this.state.list.cards);
    let newmenu = (
      <div style={{ border: '1px solid var(--primary-color)' }} className="cardedit">
        <p>New</p>
        <hr />
        <label htmlFor="side1">Side 1: </label>
        <input type="text" onChange={this.createOnChange} value={this.state.create1} className="editinput" name='create1' />
        <label htmlFor="side2">Side 2: </label>
        <input type="text" onChange={this.createOnChange} value={this.state.create2} className="editinput" name='create2' />
        <button onClick={this.onCreate}>Create</button>
      </div>
    )

    let edits = this.state.list.cards.map((elem, i) => {
      return (
        <div className="cardedit" key={i}>
          
          <label htmlFor="side1">Side 1: </label>
          <input type="text" onChange={this.editOnChange} value={this.state.list.cards[i].side1} className="editinput" name={['side1', i]} />
          <label htmlFor="side2">Side 2: </label>
          <input type="text" onChange={this.editOnChange} value={this.state.list.cards[i].side2} className="editinput" name={['side2', i]} />       
          <button style={{backgroundColor: 'rgb(199, 58, 58)'}} onClick={this.onDelete} name={i}>Delete Card</button>        
        </div>
      )
    })

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
                  <a href="" className="link" onClick={this.logout}>Logout</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="main">
          <div className="flex stuff">
            <div className="listnav">
              <h2>Selected List</h2>
              <nav>
                <ul>
                  <a className="link">
                    <li id="selectedlist">{this.state.list.name || 'Loading...'}</li>
                  </a>

                </ul>
              </nav>
            </div>
            <div style={this.state.view === 'edit' ? { overflowY: 'scroll' } : {overflowY: 'hidden'}} className="showcase">
              <div style={this.state.view === 'edit' ? { display: 'flex' } : {}} className="edit">
                {this.state.save ? <button onClick={this.onSave} className="new">Save Changes</button>: null }
                {
                  
                  edits
                }
                {
                  this.state.new ? newmenu : <button onClick={this.toggleCreate} className="new">New Card</button>
                }
                <button onClick={this.deleteList} style={{ backgroundColor: 'rgb(199, 58, 58)' }} className="new">Delete List</button>
              </div>
              {
              this.state.list.cards.length !== 0 ?
              (<React.Fragment>{this.state.view === 'flashcards' ? <Flashcards view={this.state.view} cards={this.state.list.cards}/>: null}
              {this.state.view === 'quiz' ? <Quiz view={this.state.view} cards={this.state.list.cards}/>: null}</React.Fragment>) : null
              }
            </div>
            <div className="actionnav">
              <h2>View</h2>
              <nav>
                <ul>
                  <li onClick={this.changeView} className={this.state.view === 'flashcards' ? 'active' : ''}>Flashcards</li>
                  <li onClick={this.changeView} className={this.state.view === 'quiz' ? 'active' : ''}>Quiz</li>
                  <li onClick={this.changeView} className={this.state.view === 'edit' ? 'active' : ''}>Edit</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default List
List.contextType = MyContext;