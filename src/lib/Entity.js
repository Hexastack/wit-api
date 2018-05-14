const EntityValue = require('../EntityValue')
const Expression = require('../Expression')

module.exports = function(request, cb) {
  const entityValue = EntityValue(request, cb)
  const expression = Expression(request, cb)
  return function (data) {
    this.data = data
    this.id = data.name
    this.addValue = function (value, cb) {
      return entityValue.add(this.id, value, cb)
    }
    this.deleteValue = function (value, cb) {
      return entityValue.delete(this.id, value, cb)
    }
    this.getValues = function () {
      return this.data.values
    }
    this.getValue = function (name) {
      const filtredValues = this.data.values.filter((value) => {
        return value.value === name
      })
      if (!filtredValues.length) {
        return null
      }
      return filtredValues[0]
    }
    this.addExpression = function (value, expression, cb) {
      return expression.add(this.id, value, expression, cb)
    }
    this.deleteExpression = function (value, expression, cb) {
      return expression.delete(this.id, value, expression, cb)
    }
  }
}
