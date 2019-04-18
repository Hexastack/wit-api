const Intent = function (intent) {
  this.msg_id = intent.msg_id
  this._text = intent._text
  this.entities = intent.entities
}

module.exports = Intent
