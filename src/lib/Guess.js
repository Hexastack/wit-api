const Guess = function (guess) {
  this.msg_id = guess.msg_id
  this._text = guess._text
  this.entities = guess.entities
}

module.exports = Guess
