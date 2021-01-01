import React, { Component } from 'react'
import { MyContext } from '../storage';

export class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'choice',
      ask: 'side2',
      cards: this.props.cards,
      questions: [],
      questionIndex: 0,
      isLoading: true,
      answer: ''
    };

    this.onTypeChange = this.onTypeChange.bind(this);
    this.onAskChange = this.onAskChange.bind(this);
    this.getRandomInt = this.getRandomInt.bind(this);
    this.answer = this.answer.bind(this);
  }

  componentDidMount() {
    fetch(`${this.context.state.proxy2}users/test/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({cards: this.state.cards})
    }).then(res => res.json())
      .then(json => {
        //console.log(json.questions)
        this.setState({questions: json.questions, isLoading: false, questionIndex: this.getRandomInt(0, json.questions.choice.length)});
      })
  }

  answer(e) {
    const {
      type,
      ask,
      questionIndex,
      answer,
      questions
    } = this.state
    //console.log(e);
    e.preventDefault();
    if (type === 'choice') {
        //console.log(questions.choice[questionIndex].side1.answer)
      if (questions.choice[questionIndex][ask].correct === e.target.innerHTML) {
        e.target.className += " correct"
        setTimeout(() => {
          e.target.className = "choice"
          this.setState({
          questionIndex: this.getRandomInt(0, questions.choice.length),
          answer: ''
          })
        }, 1000)
      } else {
        e.target.className += " incorrect"
        setTimeout(() => {
          e.target.className = "choice"
          this.setState({
          questionIndex: this.getRandomInt(0, questions.choice.length),
          answer: ''
          })
        }, 1000)
      }
    } else {
      if (questions.choice[questionIndex][ask].correct === answer) {
        let elem = e.target.parentElement.previousElementSibling.firstElementChild;
        elem.className += " correct"
        elem.innerHTML = "Correct! " + elem.innerHTML
        setTimeout(() => {
          elem.className = "quiz"
          elem.innerHTML = elem.innerHTML.substring(9)
          this.setState({
          questionIndex: this.getRandomInt(0, questions.choice.length),
          answer: ''
          })
        }, 2000)
      } else {
        let elem = e.target.parentElement.previousElementSibling.firstElementChild;
        elem.className += " incorrect"
        elem.innerHTML = "Incorrect! " + elem.innerHTML
        setTimeout(() => {
          elem.className = "quiz"
          elem.innerHTML = elem.innerHTML.substring(11)
          this.setState({
          questionIndex: this.getRandomInt(0, questions.choice.length),
          answer: ''
          })
        }, 2000)
      }
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  onAskChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  onTypeChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    if (this.state.isLoading) {
      return (<p>Loading...</p>)
    }
    const {
      choice,
      typed
    } = this.state.questions;
    //console.log(choice);
    return (
      <div style={this.props.view === 'quiz' ? { display: 'block' } : {}} className="quiz">
        <center>
          <label>Ask for:</label>
          <select value={this.state.ask} onChange={this.onAskChange} name="ask" id="type">
            <option value="side1">Side 1</option>
            <option value="side2">Side 2</option>
          </select>
          <br />
          <label>Response Type:</label>
          <select value={this.state.type} onChange={this.onTypeChange} name="type" id="type">           
            <option value="choice">Multiple Choice</option>
            <option value="typed">Typed</option>
          </select>
        </center>
        {this.state.type === 'choice' ?
        (<div className="question" id="multiple-choice">
          <h2 id="question-title">
            {this.state.ask === 'side1' 
            ? 
            choice[this.state.questionIndex].side1.question 
            : 
            choice[this.state.questionIndex].side2.question}
          </h2>
          <div className="choices">
            {choice[this.state.questionIndex][this.state.ask].answers.map((answer, i) => {
              return <div key={i} onClick={this.answer} className="choice">{answer}</div>
            })}
          </div>
        </div>) :
        (<div className="question" id="typed">
          <h2 id="question-title">
            {this.state.ask === 'side1' 
            ? 
            typed[this.state.questionIndex].side1.question 
            : 
            typed[this.state.questionIndex].side2.question}
          </h2>
          <div className="reveal"> 
            <h2 className="quiz" id="reveal-text"></h2>             
          </div>
          <form className="response">
            <input value={this.state.answer} onChange={(e) => this.setState({answer: e.target.value})} type="text" id="answer" name="answer" />
            <button onClick={this.answer}>Submit</button>
          </form>
        </div>)}
      </div>
    )
  }
}

export default Quiz
Quiz.contextType = MyContext;
