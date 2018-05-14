const Message = function(result, options = {context: null, thread_id: ''}) {
  this.msg_id = result.msg_id
  this._test = result._text
  this.entities = result.entities
  this.context = options.context
  this.thread_id = options.thread_id
  this.maxConfidence = function() {
    let max = {confidence: 0, entity: null}
    for(const key in this.entities) {
      let maxEntity = this.entities[key].reduce((a, b) => {
        return a.confidence > b.confidence ? a : b
      }, max)
      if (maxEntity.confidence > max.confidence ) {
        max = maxEntity
        max.entity = key
      }
    }
    return max
  }
}

const actions = {
  default: {
    method: 'GET',
    uri: '/message',
    optional: ['context', 'msg_id', 'thread_id', 'n', 'verbose']
  }
}

module.exports = function (request) {
  return function(message, options) {
    let payload = actions.default
    payload.qs = {q: message}
    for (const key in options) {
      if (actions.default.optional.indexOf(key) !== -1) {
        payload.qs[key] = options[key]
      }
    }
    return new Promise((resolve, reject) => {
      request(payload, (err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve(new Message(res, options))
      })
    })
  } 
}
