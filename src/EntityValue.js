actions = function (entity, value) {
  return {
    add: {
      method: 'POST',
      uri: `/entities/${entity}/values`
    },
    delete: {
      method: 'DELETE',
      uri: `/entities/${entity}/values/${value}`
    }
  }
}

module.exports = function (request, cb) {
  return {
    add: function (entity, value, cb) {
      let payload = actions(entity).add
      try {
        payload.body = JSON.stringify(value)
      } catch (e) {
        return cb(e, null)
      }
      request(payload, cb)
    },
    delete: function (entity, value, cb) {
      let payload = actions(entity, value).delete
      request(payload, cb)
    }
  }
}
