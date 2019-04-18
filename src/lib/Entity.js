const Entity = function (service, entity, parent) {
  this.service = service
  this.id = entity.id
  this.name = entity.name
  this.lang = entity.lang || 'en'
  this.doc = entity.doc || ''
  this.lookups = entity.lookups || []
  this.values = entity.values || []
  this.builtin = entity.builtin || false
  this.parent = parent
  this.update = async (changes) => {
    try {
      const entity = await this.service.update(this.name, changes)
      this.parent[this.name] = new Entity(this.service, entity, this.parent)
    } catch (e) {
      console.error(e)
    }
  }
  this.destroy = async () => {
    try {
      const id = await this.service.delete(this.name)
      if (id)
        return delete this.parent[this.name]
      throw (new Error('already_deleted'))
    } catch (e) {
      if (e.message === 'already_deleted') {
        console.warn(e)
      } else {
        console.error(e)
      }
    }
  }
}

module.exports = Entity
