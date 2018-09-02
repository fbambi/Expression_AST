import React, { Component } from 'react';

import { Input } from 'antd'

import Ast from './Ast'


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '',
    }
  }

  handleClick(e) {
    this.setState({
      value: e.target.value
    })
  }


  render() {
    return (
      <div className="App">

        <Input style={{ margin:'40px 0' }} onChange={this.handleClick.bind(this)} />

        <Ast expression={this.state.value} />
      </div>
    );
  }
}

export default App;
