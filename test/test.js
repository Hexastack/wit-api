var expect = require('expect.js')

var Wit = require('../')

const App = require('../src/lib/App')
const Entity = require('../src/lib/Entity')
const Intent = require('../src/lib/Intent')

var token = process.env.token
if (!token) throw 'Must pass wit app token as parameter `env token=XXXXXXXXX npm test`'

describe('Wit', function () {
  describe('Instantiation', function () {
    it('Should create an instance of Wit', function () {
      expect(new Wit(token)).to.be.a(Wit)
    })
    it('Should contain doRequest method', function () {
      expect(new Wit(token)).to.have.property('doRequest')
    })
    it('Must not hold or show the token', function () {
      const wit = new Wit(token)
      for (var key in wit) {
        expect(wit[key]).to.not.be.equal(token)
      }
    })
  })

  const wit = new Wit(token)

  describe('Entity services', function () {
    describe('Get all entities', function () {
      it('Should return list of entites', function () {
        return wit.entity.list().then(entities => {
          expect(entities).to.be.an(Array)
          expect(entities).not.to.be.empty()
          expect(entities[0]).to.be.an(Entity)
          expect(entities[0].id).to.be.empty()
        })
      })
    })

    describe('Get one entity by name', function () {
      it('Should fetch an Entity', function () {
        return wit.entity.get('wit$bye').then(entity => {
          expect(entity).to.be.an(Entity)
          expect(entity.id).not.to.be.empty()
        })
      })
    })

    describe('Add a new entity', function () {
      before(function () {
        return wit.entity.delete('played_games').then(res => {
        }).catch(e => {
        })
      })
      it('Shoud add an Entity', function () {
        return wit.entity.add('played_games', 'Video games I played').then(entity => {
          expect(entity).to.be.an(Entity)
          expect(entity.id).not.to.be.empty()
          expect(entity.name).to.be('played_games')
          expect(entity.doc).to.be('Video games I played')
        })
      })
    })

    describe('Edit and save an existant entity', function () {
      before(function () {
        return wit.entity.delete('beverage').then(res => {
          return wit.entity.add('beverage', 'Favorit drinks').then(entity => {
          })
        }).catch(e => {
          if (e.code === 'not-found') {
            return wit.entity.add('beverage', 'Favorit drinks').then(entity => {
            })
          } else {
            console.error(e)
          }
        })
      })
      it('Shoud update an Entity', function () {
        const changes = {
          doc: 'drinks I like',
          values: [
            {
              value: 'coffee',
              expressions: [
                'kawa',
                'black beans',
                'arabica'
              ]
            }
          ]
        }
        return wit.entity.update('beverage', changes).then(entity => {
          expect(entity).to.be.an(Entity)
          expect(entity.id).not.to.be.empty()
          expect(entity.values).not.to.be.empty()
          expect(entity.doc).to.be('drinks I like')
        })
      })
    })

    describe('Deletes entities', function () {
      before(function () {
        return wit.entity.add('website').then(entity => {
          return wit.entity.add('webpage').then(entity => {
          })
        }).catch(e => {
          console.error(e)
        })
      })
      it('Should delete an Entity', function () {
        return wit.entity.delete('website').then(res => {
          expect(res).to.have.property('deleted')
        })
      })
      it('Should delete an other Entity', function () {
        return wit.entity.delete('webpage').then(res => {
          expect(res).to.have.property('deleted')
        })
      })
    })
  })

  describe('Value services', function () {
    beforeEach(function () {
      return wit.entity.add('country').then(entity => {
        return wit.entity.update('country', { values: [{ value: 'Yugoslavia' }] }).then(entity => {
        })
      }).catch(e => {
        return wit.entity.update('country', { values: [{ value: 'Yugoslavia' }] }).then(entity => {
        })
      })
    })
    it('Should add a value', function () {
      return wit.value.add('country', 'Tunisia', ['Tunisia', 'etoile du nord'], {continent: 'africa'}).then((entity) => {
        expect(entity).to.be.an(Entity)
        expect(entity.id).not.to.be.empty()
        expect(entity.lookups).to.contain('keywords')
      }).catch(e => {
        console.error(e)
      })
    })
    it('Should remove a value', function () {
      return wit.value.delete('country', 'Yugoslavia').then((res) => {
        expect(res).to.have.property('deleted')
      })
    })
  })

  describe('Expression services', function () {
    beforeEach(function () {
      return wit.entity.add('country').then(entity => {
        return wit.entity.update('country', { values: [{ value: 'Yugoslavia', expressions: ['SFRY'] }] }).then(entity => {
        })
      }).catch(e => {
        return wit.entity.update('country', { values: [{ value: 'Yugoslavia', expressions: ['SFRY'] }] }).then(entity => {
        })
      })
    })
    it('Should add an expression', function () {
      return wit.expression.add('country', 'Yugoslavia', 'State of Slovenes, Croats and Serbs').then((entity) => {
        expect(entity).to.be.an(Entity)
        expect(entity.id).not.to.be.empty()
      }).catch(e => {
        console.error(e)
      })
    })
    it('Should remove an expression', function () {
      return wit.expression.delete('country', 'Yugoslavia', 'SFRY').then((res) => {
        expect(res).to.have.property('deleted')
      })
    })
  })
})
