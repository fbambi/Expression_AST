
import isInQuote from '../isInQuote'

export const ARITHMETIC_OPERATOR = 'ARITHMETIC_OPERATOR'
export const COMPARISON_OPERATOR = 'COMPARISON_OPERATOR'
export const LOGICAL_OPERATOR = 'LOGICAL_OPERATOR'
export const SINGLE_QUOTE = 'SINGLE_QUOTE'
export const DOUBLE_QUOTE = 'DOUBLE_QUOTE'
export const LEFT_PAREN = 'LEFT_PAREN'
export const RIGHT_PAREN = 'RIGHT_PAREN'
export const COMMA = 'COMMA'
export const IDENTIFIER = 'IDENTIFIER'
export const STRING = 'STRING'
export const NUMBER = 'NUMBER'
export const WHITE_SPACE = 'WHITE_SPACE'

const TOKEN = [{
  type: ARITHMETIC_OPERATOR,
  check: (expr, context) => {
    if (isInQuote(context)) return null
    const reg = /^(\+|-|\*|\/)/
    const result = expr.match(reg)
    return result
  }
},
{
  type: COMPARISON_OPERATOR,
  check: (expr, context) => {
    if (isInQuote(context)) return null
    const reg = /^>|>=|<|<=|!=|=/
    const result = expr.match(reg)
    return result
  }
},
{
  type: LOGICAL_OPERATOR,
  check: (expr, context) => {
    if (isInQuote(context)) return null
    const reg = /^and|or|not/
    const result = expr.match(reg)
    return result
  }
},
{
  type: SINGLE_QUOTE,
  check: (expr, { isInDoubleQuote }) => {
    if (isInDoubleQuote) return null
    const reg = /^'/
    const result = expr.match(reg)
    return result
  }
},
{
  type: DOUBLE_QUOTE,
  check: (expr, { isInSingleQuote }) => {
    if (isInSingleQuote) return null
    const reg = /^"/
    const result = expr.match(reg)
    return result
  }
},
{
  type: LEFT_PAREN,
  check: (expr, context) => {
    if (isInQuote(context)) return null
    const reg = /^\(/
    const result = expr.match(reg)
    return result
  }
},
{
  type: RIGHT_PAREN,
  check: (expr, context) => {
    if (isInQuote(context)) return null
    const reg = /^\)/
    const result = expr.match(reg)
    return result
  }
},
{
  type: COMMA,
  check: (expr, context) => {
    if (isInQuote(context)) return null
    const reg = /^,/
    const result = expr.match(reg)
    return result
  }
},
{
  type: IDENTIFIER,
  check: (expr, context) => {
    if (isInQuote(context)) return null
    const reg = /^[a-zA-Z_]{1}[a-zA-Z0-9_-]*/
    const result = expr.match(reg)
    return result
  }
},
{
  type: STRING,
  check: (expr, context) => {
    if (!isInQuote(context)) return null
    const { isInSingleQuote, isInDoubleQuote } = context
    const regStr = `^[^${isInDoubleQuote ? '"' : "'"}]+`
    const reg = new RegExp(regStr)
    const result = expr.match(reg)
    return result
  }
},
{
  type: NUMBER,
  check: (expr, context) => {
    if (isInQuote(context)) return null
    const reg = /^[1-9]{1}[0-9]*(\.[0-9]+)?/
    const result = expr.match(reg)
    return result
  }
},
{
  type: WHITE_SPACE,
  check: (expr, context) => {
    if (isInQuote(context)) return null
    const reg = /^\s+/
    const result = expr.match(reg)
    return result
  }
}
]



export default TOKEN
