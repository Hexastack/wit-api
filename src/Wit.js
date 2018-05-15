const request = require('request')
const requestApi = require('./lib/requestAPI')

const message = require('./Message')
const speech = require('./Speech')
const entity = require('./Entity')
const value = require('./Value')
const expression = require('./Expression')
const train = require('./Train')
const app = require('./App')

const App = require('./lib/App')
const Entity = require('./lib/Entity')
const Intent = require('./lib/Intent')

Date.prototype.getFormattedDate = function() {
  const date = this.getDate()
  return date < 10 ? `0${date}` : date
}
Date.prototype.getFormattedMonth = function() {
  const month = this.getMonth() + 1
  return month < 10 ? `0${month}` : month
}

const getVersion = function() {
  const date = new Date()
  return `${date.getFullYear()}${date.getFormattedMonth()}${date.getFormattedDate()}`
}



const Wit = function(token) {
  this.token = token
  const requestWrapper = request.defaults({
    baseUrl: 'https://api.wit.ai/',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    qs: {
      v: getVersion()
    },
    timeout: 20000
  })
  this.doRequest = requestApi(requestWrapper)
  this.message = message(this.doRequest)
  this.speech = speech(this.doRequest)
  this.entity = entity(this.doRequest)
  this.Value = value(this.doRequest)
  this.expression = expression(this.doRequest)
  this.train = train(this.doRequest)
  this.app = app(this.doRequest)
  this.App = function(name, data) {
    return new App(name, this.doRequest, data)
  }
  this.Entity = function(name, data) {
    return new Entity(name, this.doRequest, data)
  }
  this.Intent = function(result, options) {
    return new Intent(result, options)
  }
}

module.exports = Wit
