const Intent = function (result, options = { context: null, thread_id: '' }) {
  this.msg_id = result.msg_id
  this._test = result._text
  this.entities = result.entities
  this.context = options.context
  this.thread_id = options.thread_id
  this.maxConfidence = function () {
    let max = { confidence: 0, entity: null }
    for (const key in this.entities) {
      let maxEntity = this.entities[key].reduce((a, b) => {
        return a.confidence > b.confidence ? a : b
      }, max)
      if (maxEntity.confidence > max.confidence) {
        max = maxEntity
        max.entity = key
      }
    }
    return max
  }
}
// Methods
Object.assign(Intent.prototype, {
  
})

module.exports = Intent
