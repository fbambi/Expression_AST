import TOKEN from './token'
import getAst from './ast/ast'
import { WHITE_SPACE } from './token/TOKEN';

const TOKEN_CHECK = TOKEN

const getToken = (expr, token) => {
  for (let i = 0; i < TOKEN_CHECK.length; i++) {
    const { check, type } = TOKEN_CHECK[i]
    const result = check(expr, token)
    if (result) {
      return { type, value: result[0] }
    }
  }
  throw new Error(`Unrecognized token ${expr[0]}`)
}

const parse = (expr) => {

  let context = {
    isInSingleQuote: false,
    isInDoubleQuote: false,
  }

  const tokenList = []
  let token

  while (expr) {
    token = getToken(expr, context, token)

    // a+b+a*b

    const { type } = token

    const { isInSingleQuote, isInDoubleQuote } = context

    if (type === 'SINGLE_QUOTE' && !isInDoubleQuote) {
      context.isInSingleQuote = !isInSingleQuote
    }
    if (type === 'DOUBLE_QUOTE' && !isInSingleQuote) {
      context.isInDoubleQuote = !isInDoubleQuote
    }

    if (token.type !== WHITE_SPACE) {
      tokenList.push(token)
    }

    expr = expr.slice(token.value.length)

  }

  let ast = getAst(tokenList)

  return ast

}

export default parse