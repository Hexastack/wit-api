const Guess = function (guess, language) {
  this.msg_id = guess.msg_id
  this._text = guess._text
  this.entities = guess.entities
  this.language = language
  this.filter = (threshold = .9) => {
    const filtered = {}
    Object.keys(this.entities).forEach(key => {
      filtered[key] = this.entities[key].filter(e => e.confidence >= threshold).sort((a, b) => b.confidence - a.confidence)
    })
    if(this.language) {
      filtered.language = this.language.filter(threshold)
    }
    return filtered
  }
  this.softFilter = (threshold = .9) => {
    const filtered = {}
    Object.keys(this.entities).forEach(key => {
      filtered[key] = this.entities[key].filter(e => e.confidence >= threshold).sort((a, b) => b.confidence - a.confidence)
      if (!filtered[key].length) {
        filtered[key] = [this.entities[key].sort((a, b) => b.confidence - a.confidence)[0]]
      }
    })
    if(this.language) {
      filtered.language = this.language.softFilter(threshold)
    }
    return filtered
  }
  this.bestGuesses = () => {
    const filtered = {}
    Object.keys(this.entities).forEach(key => {
      filtered[key] = this.entities[key].sort((a, b) => b.confidence - a.confidence)[0]
    })
    if(this.language) {
      filtered.language = this.language.bestGuesses()
    }
    return filtered
  }
}

module.exports = Guess
