const actions = function (id) {
  return {
    get: {
      method: 'GET',
      path: '/entities'
    },
    find: {
      method: 'GET',
      path: `/entities/${id}`
    },
    add: {
      method: 'POST',
      path: '/entities'
    },
    update: {
      method: 'PUT',
      path: `/entities/${id}`
    },
    delete: {
      method: 'DELETE',
      path: `/entities/${id}`
    }
  }
}

module.exports = function (request) {
  return {
    async get () {
      const options = actions().get
      return await request(options)
    },
    async find (id) {
      const options = actions(id).find
      return await request(options)
    },
    async add (name, doc = '') {
      const options = actions().add
      return await request(options, {id: name, doc})
    },
    async update (id, changes) {
      const options = actions(id).update
      return await request(options, changes)
    },
    async delete (id) {
      const options = actions(id).delete
      return await request(options)
    },
    async sync () {
      try {
        let entities = await this.get()
        return await Promise.all(entities.map(e => this.find(e)))
      } catch(e) {
        console.error(e)
      }
    }
  }
}
