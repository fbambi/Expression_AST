import React, { Component } from 'react'

export default class SA extends Component {

  constructor(props) {
    super(props)
    this.state = {
      count: 1
    }
  }
  componentWillReceiveProps(nextProps) {

  }
  render() {
    const { children } = this.props

    const item = React.createElement(
      children.type,
      {
        ...children.props,
        onClick: (e) => {
          const { onClick } = children.props
          console.log('---------------')
          console.log('SA trigger!')
          onClick && onClick(e)
          this.setState({
            count: this.state.count + 1
          })
        }
      },
      children.props.children,
    )
    const child = React.cloneElement(
      children,
      {
        onClick: (e) => {
          const { onClick } = children.props
          console.log('---------------')
          console.log('SA trigger!')
          onClick && onClick(e)
          this.setState({
            count: this.state.count + 1
          })
        },
      },
      children.props.children,
    )
    return child
  }
}
