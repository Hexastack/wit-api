const Language = function (language) {
  this.detected_locales = language.detected_locales
  this.filter = (threshold = .9) => {
    return this.detected_locales.filter(e => e.confidence >= threshold).sort((a, b) => b.confidence - a.confidence)
  }
  this.softFilter = (threshold = .9) => {
    const filtered = this.detected_locales.filter(e => e.confidence >= threshold).sort((a, b) => b.confidence - a.confidence)
    if (!filtered.length) {
      filtered = [this.detected_locales.sort((a, b) => b.confidence - a.confidence)[0]]
    }
    return filtered
  }
  this.bestGuesses = () => {
    return this.detected_locales.sort((a, b) => b.confidence - a.confidence)[0]
  }
}

module.exports = Language
