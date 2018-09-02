
import {
  ARITHMETIC_OPERATOR,  // + - * /
  COMPARISON_OPERATOR,  // < > <= >= = !=
  LOGICAL_OPERATOR,     // and or not
  SINGLE_QUOTE,         // '
  DOUBLE_QUOTE,         // "
  LEFT_PAREN,           // (
  RIGHT_PAREN,          // )
  COMMA,                // ,
  IDENTIFIER,           // ABC
  STRING,               // 'abc'
  NUMBER,               // 123
  WHITE_SPACE,          //  
} from '../token/TOKEN';

const PRECEDENCE = {

}

// SUM(a,b)
const CALL_EXPRESSION = 'CallExpression'

// ARITHMETIC_OPERATOR   + - * /
// COMPARISON_OPERATOR   < > <= >= != =
const BINARY_EXPRESSION = 'BinaryExpression'

// LOGICAL_OPERATOR   and not or
const LOGICAL_EXPRESSION = 'LogicalExpression'

const IDENTIFIER_EXPRESSION = 'Identifier'

const LITERAL = 'Literal'

const isLeftParren = token => token.type === LEFT_PAREN
const isRightParren = token => token.type === RIGHT_PAREN
const isIdentifier = token => token.type === IDENTIFIER

const getRightParrenIndex = (tokenList) => {
  let leftParrenCount = 0
  let index = 0;
  while (index < tokenList.length) {
    const { type } = tokenList[index]
    if (type === LEFT_PAREN) leftParrenCount++
    if (type === RIGHT_PAREN) {
      if (leftParrenCount === 0) return index
      leftParrenCount--
    }
    index++
  }
  return -1
}

const isNextCallExpression = (tokenList) => {
  if (!isIdentifier(tokenList[0]) || !tokenList[1] || !isLeftParren(tokenList[1])) return false
  const rightParren = getRightParrenIndex(tokenList.slice(2))
  if (rightParren === -1) {
    throw new Error('expected ) !')
  }
  return true
}

const getCallArguments = (tokenList) => {

  const callArguments = [];
  let currentArgu = [];
  let parrenCount = 0;

  let index = 0;
  while (index < tokenList.length) {
    const { type, value } = tokenList[index]
    const token = tokenList[index]

    switch (type) {
      case LEFT_PAREN:
        parrenCount++
        currentArgu.push(token)
        break;

      case RIGHT_PAREN:
        if (parrenCount === 0) {
          throw new Error(`Unexpected ) !`)
        }
        parrenCount--
        currentArgu.push(token)
        break;

      case COMMA:
        if (currentArgu.length === 0) throw new Error('Unexpected , !')
        if (parrenCount > 0) {
          // console.log(parrenCount)
          currentArgu.push(token)
        } else {
          callArguments.push(currentArgu)
          currentArgu = []
        }
        break;

      default:
        currentArgu.push(token)
        break;
    }
    if (index === tokenList.length - 1) {
      callArguments.push(currentArgu)
    }
    index++
  }

  return callArguments
}


const createCallExpression = (tokenList) => {
  const callee = {
    name: tokenList[0].value,
    type: IDENTIFIER_EXPRESSION
  }

  const callArguments = getCallArguments(tokenList.slice(2, -1))
    .filter(arr => arr.length !== 0)
    .map(tokenList => getAst(tokenList))


  return {
    type: CALL_EXPRESSION,
    arguments: callArguments,
    callee: callee,
  }

}


const limit = 200;
const getLimitChecker = () => {
  let count = 0
  return () => {
    if (count++ < limit) return true
    console.error('stack execced')
    return false
  }
}
const checker = getLimitChecker()


const getAst = (tokenList) => {
  if (tokenList.length === 0) return {}

  let ast = {}

  let current = ast

  let index = 0;
  while (index === 0 && checker()) {

    const { type, value } = tokenList[index]
    let result = {};

    const params = [index, tokenList[index], tokenList]

    switch (type) {
      case IDENTIFIER:
        result = getIdentifierNode(...params)
        break;

      case SINGLE_QUOTE:
      case DOUBLE_QUOTE:
        result = getStringNode(...params)
        break;

      case NUMBER:
        result = getNumberNode(...params)
        break;

      default:
        throw new Error(`Unexpected character ${value}`)

        break;
    }

    const { node, index: actualIndex } = result
    index = actualIndex

    if (index > tokenList.length - 1) {
      ast = getSingleNodeExpression(node)
    } else {
      ast = getGenaralExpression(node, index, tokenList)
    }

  }

  return ast

}

const getIdentifierNode = (index, { type, value }, tokenList) => {
  let node;
  const actualTokenList = tokenList.slice(index)
  if (isNextCallExpression(actualTokenList)) {
    const last = getRightParrenIndex(actualTokenList.slice(2)) + 2
    node = createCallExpression(tokenList.slice(index, last + 1))
    index = last + 1
  } else {
    node = {
      type: IDENTIFIER_EXPRESSION,
      name: value,
    }
    index++
  }

  return {
    node,
    index,
  }
}

const getStringNode = (index, { type, value }, tokenList) => {
  const stringToken = tokenList[index + 1]
  const closedQuoteToken = tokenList[index + 1]
  if (

    // 这个条件其实不会成立
    // 因为分词阶段保证开引号后面一定是STRING
    stringToken.type !== STRING
    || !closedQuoteToken
    || closedQuoteToken.type !== type) throw new Error(`Unclosed quote after ${value + stringToken.value}!`)

  return {
    node: {
      type: LITERAL,
      value,
    },
    index: index + 3
  }
}

const getNumberNode = (index, { value }, tokenList) => {
  return {
    node: {
      type: LITERAL,
      value,
    },
    index: ++index,
  }
}

const getSingleNodeExpression = (node) => {
  return node
}


const operatorTypeList = [
  ARITHMETIC_OPERATOR,
  COMPARISON_OPERATOR,
  LOGICAL_OPERATOR,
]

const allowTypeAfterOperator = [
  SINGLE_QUOTE,
  DOUBLE_QUOTE,
  NUMBER,
  IDENTIFIER,
]

const getGenaralExpression = (node, index, tokenList) => {

  const { type: operatorType, value: operatorValue } = tokenList[index]

  if (!operatorTypeList.includes(operatorType)) {
    throw new Error(`Unrecognize operator type ${operatorValue}`)
  }

  const expressionType = operatorType === LOGICAL_OPERATOR
    ? LOGICAL_EXPRESSION
    : BINARY_EXPRESSION

  const rightExpression = tokenList[index + 1]
  if (!rightExpression || !allowTypeAfterOperator.includes(rightExpression.type)) {
    throw new Error(`Expected expression after ${operatorValue}`)
  }

  const expression = {
    type: expressionType,
    left: node,
    right: getAst(tokenList.slice(index + 1)),
    operator: operatorValue
  }
  return expression
}

export default getAst


