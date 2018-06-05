const Entity = function (name, request, data = {
  id: '', values: [], builtin: false, doc: '', lang: 'en', lookups: []
}) {
  this.name = name
  this.id = data.id
  this.values = data.values || []
  this.builtin = data.builtin
  this.doc = data.doc
  this.lang = data.lang
  this.lookups = data.lookups
  this.request = request
}
// Methods
Object.assign(Entity.prototype, {
  sync () {
    let payload = {
      method: 'GET',
      uri: `/entities/${this.name}`
    }
    function doRequest(request, payload, self) {
      return new Promise((resolve, reject) => {
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          return resolve(Object.assign(self, new Entity(res.name, request, res)))
        })
      })
    }
    async function reassign(self) {
      return await doRequest(self.request, payload, self)
    }
    return reassign(this)
  },
  save () {
    let payload = {
      method: 'PUT',
      uri: `/entities/${this.id}`
    }
    const body = {
      id: this.name,
      doc: this.doc,
      values: this.values
    }
    function doRequest(request, payload, self) {
      return new Promise((resolve, reject) => {
        try {
          payload.body = JSON.stringify(body)
        } catch (e) {
          return reject(e)
        }
        request(payload, (err, res) => {
          if (err) {
            return reject(err)
          }
          if (body.values) {
            res.values = body.values
          }
          return resolve(Object.assign(self, new Entity(res.name, request, res)))
        })
      })
    }
    async function reassign(self) {
      return await doRequest(self.request, payload, self)
    }
    return reassign(this)
  }
})

module.exports = Entity
