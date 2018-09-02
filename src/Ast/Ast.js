import React, { Component } from 'react'

import createAst from './createAst'



const DIFF = 4;
export default class Ast extends Component {

  getOrder = (value) => {
    return [
      'type',

      'operator',
      'left',
      'right',

      'arguments',
      'callee',

      'value',

      'name',
    ].indexOf(value)
  }

  getIndent = (num) => {
    const result = (new Array(num)).fill('').join('&nbsp;')
    return result
  }

  drawAst = (ast, indent = 2) => {

    const result = Object.entries(ast)
      .sort((a, b) => this.getOrder(a[0]) - this.getOrder(b[0]))
      .reduce((result, [key, value]) => {
        const current = []
        if (typeof value === 'string') {
          current.push({ indent, value: `${key}: '${value}'` })
        } else {
          current.push(
            { indent, value: `${key}:` },
            ...this.drawAst(value, indent + DIFF),
          )
        }
        return [
          ...result,
          ...current,
        ]

      }, [])

    return result

  }

  render() {

    const ast = createAst(this.props.expression)
    console.log(ast)
    const result = this.drawAst(ast)
    return (
      <div>
        <ul>
          {
            result.map((item, index) => {
              return <li key={item + index}
                style={{
                  // display: 'block',
                  marginLeft: item.indent * 10,
                  fontFamily: 'consolas'
                }}
              >
                {item.value}
              </li>
            })
          }
        </ul>
      </div>
    )
  }
}
