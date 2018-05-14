const Expression = require('../Expression')

module.exports = function (request, cb) {
  const expression = Expression(request, cb)
  return function (data) {
    this.data = data
    this.id = data.id
    this.value = data.value
    this.addExpression = function (expression, cb) {
      return expression.add(this.id, this.value, expression, cb)
    }
    this.deleteExpression = function (expression, cb) {
      return expression.delete(this.id, this.value, expression, cb)
    }
    this.getExpressions = function () {
      return this.data.expressions
    }
    this.getExpression = function (name) {
      const filtredValues = this.data.expressions.filter((expression) => {
        return expression.expression === name
      })
      if (!filtredValues.length) {
        return null
      }
      return filtredValues[0]
    }
  }
}
