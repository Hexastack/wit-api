const actions = function () {
  return {
    get: {
      method: 'GET',
      path: '/samples'
    },
    add: {
      method: 'POST',
      path: '/samples'
    },
    delete: {
      method: 'DELETE',
      path: '/samples'
    }
  }
}

module.exports = function (request) {
  return {
    async get (limit = 10, offset = 0, entities = [], values = [], isNegative = false) {
      let options = actions().get
      options.qs = {limit, offset, negative: isNegative}
      if (entities.length) {
        options.qs.entity_ids = entities
        if (values.length) {
          options.qs.entity_values = values
        }
      }

      return await request(options)
    },
    async add (text, entities) {
      const options = actions().add
      return await request(options, [{text, entities}])
    },
    async train (dataset) {
      const options = actions().add
      return await request(options, dataset)
    },
    async delete (text) {
      const options = actions().delete
      return await request(options, [{text}])
    },
    async forget (dataset) {
      const options = action().delete
      return await request(options, dataset.map(d => {
        return {text: d.text}
      }))
    }
  }
}
