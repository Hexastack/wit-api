const App = function (name, request, data = {
  id: '', private: false, description: '', lang: 'en', created_at: new Date().toISOString().replace('T', ' ').replace(/\.\d+Z/, '')
}) {
  this.name = name
  this.id = data.id
  this.private = data.private
  this.description = data.description
  this.lang = data.lang
  this.created_at = data.created_at
  this.token = data.token || ''
  this.request = request
}
// Methods
Object.assign(App.prototype, {
  
})

module.exports = App