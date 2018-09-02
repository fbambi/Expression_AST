import React, { Component } from 'react'

export default class Button extends Component {

  static defaultProps = {
    count: 1
  }
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      arr: []
    }
  }

  componentWillReceiveProps(){
    console.trace()
  }
  componentDidMount() {
    console.log('Button mount')
  }
  handleClick(e) {
    // this.props.onClick(e);
    // this.state.arr.push(1)
    this.setState(prevState => ({
      // arr: this.state.arr
    }))
  }
  render() {
    console.log('Button render')
    return (
      <div onClick={this.handleClick} style={{ cursor: 'pointer' }}>
        I 'm a Button
        {this.state.arr.length}
      </div>
    )
  }
}
