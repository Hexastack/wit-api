actions = function (entity, value, expression) {
  return {
    add: {
      method: 'POST',
      uri: `/entities/${entity}/values/${value}/expressions`
    },
    delete: {
      method: 'DELETE',
      uri: `/entities/${entity}/values/${value}/expressions/${expression}`
    }
  }
}

module.exports = function (request, cb) {
  return {
    add: function (entity, value, expression, cb) {
      let payload = actions(entity, value).add
      try {
        payload.body = JSON.stringify(value)
      } catch (e) {
        return cb(e, null)
      }
      request(payload, cb)
    },
    delete: function (entity, value, expression, cb) {
      let payload = actions(entity, value, expression).delete
      request(payload, cb)
    }
  }
}
