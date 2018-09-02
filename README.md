# Expression_AST

A simple Expression AST builder

## usage
base on `create-react-app`

`npm i` & `npm start`

## test expression
`ADD(POW(b1, 2), b2 and b3) + SUB(MULTI(b3, 4), 10)`

## support list
+ `CallExpression(e.g. SUM(a,b))`
+ `BinaryExpression( +, -, *, /, >, <, >=, <=, =, !=)`
+ `LogicalExpression(and, or, not)`
+ `Literal('string', 123)`
+ `Identifier(b1, b2)`

## todo list
+ quote bug
+ better error tips
+ error with position
+ export API

