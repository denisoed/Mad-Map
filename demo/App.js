import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Demo from './demo'

// Components
const About = ({ match, props }) => (
  <div style={{ width: '100%', height: 540 }}>
    <h1>About page {props}</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  </div>
);

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <Router>
        <Route exact path="/" component={Demo} />
        <Route path="/about" component={About} />
      </Router>
    )
  }
}