const init = require('./lib/init')
const SampleService = require('./SampleService')
const EntityService = require('./EntityService')
const GuessService = require('./GuessService')
const Entity = require('./lib/Entity')

Date.prototype.getFormattedDate = function () {
  const date = this.getDate()
  return date < 10 ? `0${date}` : date
}
Date.prototype.getFormattedMonth = function () {
  const month = this.getMonth() + 1
  return month < 10 ? `0${month}` : month
}

const getVersion = function () {
  const date = new Date()
  return `${date.getFullYear()}${date.getFormattedMonth()}${date.getFormattedDate()}`
}

const Wit = function (token, options = { version: getVersion(), timeout: 20000, debug: false }) {
  this.request = init(token, options.version, options.timeout, options.debug)
  this.services = {
    sample: SampleService(this.request),
    entity: EntityService(this.request),
    guess: GuessService(this.request)
  }
  this.entities = {}
  this.reset = () => {
    this.entities = {}
    this.entities.add = async (name, doc) => {
      try {
        const entity = await this.services.entity.add(name, doc)
        this.entities[entity.name] = new Entity(this.services.entity, entity, this.entities)
      } catch (e) {
        console.error(e)
      }
    }
  }
  this.reset()
  this.init = async () => {
    try {
      const entities = await this.services.entity.sync()
      entities.forEach(e => {
        this.entities[e.name] = new Entity(this.services.entity, e, this.entities)
      })
    } catch (e) {
      console.error(e)
    }
  }
  this.sync = async () => {
    this.reset()
    await this.init()
  }
}

module.exports = Wit
