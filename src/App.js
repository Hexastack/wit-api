const actions = {
  list: {
    method: 'GET',
    uri: '/apps'
  },
  add: {
    method: 'POST',
    uri: '/apps'
  },
  update: {
    method: 'POST',
    uri: '/apps'
  },
  delete: {
    method: 'DELETE',
    uri: '/apps'
  }
}

module.exports = function (request, cb) {
  return {
    list: function (cb) {
      const payload = actions.list
      request(payload, cb)
    },
    add: function (app, cb) {
      let payload = actions.add
      try {
        payload.body = JSON.stringify(entity)
      } catch (e) {
        return cb(e, null)
      }
      request(payload, cb)
    },
    update: function (id, changes, cb) {
      let payload = actions.update
      payload.uri += `/${id}`
      try {
        payload.body = JSON.stringify(changes)
      } catch (e) {
        return cb(e, null)
      }
      request(payload, cb)
    },
    delete: function (id, cb) {
      let payload = actions.delete
      payload.uri += `/${id}`
      request(payload, cb)
    }
  }
}
