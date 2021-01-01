import React, { Component } from 'react'
import { MyContext } from '../storage';

import '../App.css'

export class Flashcards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardindex: 0,
      cards: this.props.cards,
      side1: true,
      change: false
    };

    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.flip = this.flip.bind(this);
  }

  next() {
    if (this.state.cards.length - 1 !== this.state.cardindex) {
      this.setState(prevState => {
        return {cardindex: prevState.cardindex + 1, side1: true, change: true}
      });
    }
  }

  back() {
    if (0 !== this.state.cardindex) {
      this.setState(prevState => {
        return {cardindex: prevState.cardindex - 1, side1: true, change: true}
      });
    }
  }

  flip() {
    this.setState({
      side1: !this.state.side1
    });
  }

  componentDidUpdate() {
    if (this.state.change === true) {
      setTimeout(() => {        
        this.setState({
          change: false
        });
      }, 250)
    }
  }

  render() {
    const {
      cardindex,
      cards
    } = this.state;

    let divclass = this.state.side1 ? '' : ' is-flipped';

    let cardtransition = this.state.change ? {animation: 'myanimation 0.25s linear'} : {}

    return (
      <div style={this.props.view === 'flashcards' ? { display: 'flex' } : {}} className="flashcards">
        <div style={cardtransition} onClick={this.flip} className={"card" + divclass}>
          <div className="front"><h1>{cards[cardindex].side1}</h1></div>
          <div className="back"><h1>{cards[cardindex].side2}</h1></div>
        </div>
        <nav>
          <ul>
            <li onClick={this.back}>
              &#8592; Back
            </li>
            <li>
              Card {cardindex + 1}
            </li>
            <li onClick={this.next}>
              Next &#8594;
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default Flashcards
Flashcards.contextType = MyContext;
