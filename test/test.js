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
        }).catch(e => {
          expect(e).to.not.be.ok()
        })
      })
    })

    describe('Get one entity by name', function () {
      it('Should fetch an Entity', function () {
        return wit.entity.get('wit$bye').then(entity => {
          expect(entity).to.be.an(Entity)
          expect(entity.id).not.to.be.empty()
        }).catch(e => {
          expect(e).to.not.be.ok()
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
        }).catch(e => {
          expect(e).to.not.be.ok()
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
        }).catch(e => {
          expect(e).to.not.be.ok()
        })
      })
    })

    describe('Deletes entities', function () {
      before(function () {
        return wit.entity.add('website').then(entity => {
          return wit.entity.add('webpage').then(entity => {
          })
        }).catch(e => {
        })
      })
      it('Should delete an Entity', function () {
        return wit.entity.delete('website').then(res => {
          expect(res).to.have.property('deleted')
        }).catch(e => {
          expect(e).to.not.be.ok()
        })
      })
      it('Should delete an other Entity', function () {
        return wit.entity.delete('webpage').then(res => {
          expect(res).to.have.property('deleted')
        }).catch(e => {
          expect(e).to.not.be.ok()
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
      return wit.value.add('country', 'Tunisia', ['Tunisia', 'etoile du nord'], { continent: 'africa' }).then((entity) => {
        expect(entity).to.be.an(Entity)
        expect(entity.id).not.to.be.empty()
        expect(entity.lookups).to.contain('keywords')
      }).catch(e => {
        expect(e).to.not.be.ok()
      })
    })
    it('Should remove a value', function () {
      return wit.value.delete('country', 'Yugoslavia').then((res) => {
        expect(res).to.have.property('deleted')
      }).catch(e => {
        expect(e).to.not.be.ok()
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
        expect(e).to.not.be.ok()
      })
    })
    it('Should remove an expression', function () {
      return wit.expression.delete('country', 'Yugoslavia', 'SFRY').then((res) => {
        expect(res).to.have.property('deleted')
      }).catch(e => {
        expect(e).to.not.be.ok()
      })
    })
  })

  describe('Learning', function () {
    describe('Train using one sample at a time', function () {
      it('Should yeild on a json response', function () {
        return wit.train('This is meant to be unlearned', [
          {
            entity: "country",
            value: "Tunisia"
          }
        ]).then(resZero => {
          return wit.train('Hello Tunisia', [
            {
              entity: "country",
              value: "Tunisia",
              start: 6,
              end: 13
            },
            {
              entity: "wit$greetings",
              value: true,
              start: 0,
              end: 5
            }
          ]).then(resOne => {
            return wit.train('Tunis says hi', [
              {
                entity: "country",
                value: "Tunisia",
                start: 0,
                end: 5
              },
              {
                entity: "wit$greetings",
                value: true,
                start: 11,
                end: 13
              }
            ]).then(resTwo => {
              expect(resOne).to.be.an(Object)
              expect(resOne).to.be.eql(resTwo)
              expect(resOne).to.be.eql(resZero)
              expect(resOne.sent).to.be.ok()
              expect(resOne.n).to.be.ok()
            }).catch(e => {
              expect(e).to.not.be.ok()
            })
          }).catch(e => {
            expect(e).to.not.be.ok()
          })
        }).catch(e => {
          expect(e).to.not.be.ok()
        })
      })
    })
    describe('Unlearn one sample', function () {
      return wit.forget('This is meant to be unlearned').then(res => {
        expect(res).to.be.an(Object)
        expect(res.sent).to.be.ok()
        expect(res.n).to.be.ok()
      }).catch(e => {
        expect(e).to.not.be.ok()
      })
    })
  })

  describe('Text messages', function () {
    describe('Test on a learned text', function () {
      it('Should respond by an Intent Object', function () {
        const options = {
          context: {
            locale: 'en_US'
          },
          n: 4 // returns up to 4 possible intents
        }
        return wit.message('holla tunisia', options).then((intent) => {
          expect(intent).to.be.an(Intent)
          expect(intent).to.have.property('entities')
          expect(intent.entities).not.to.be.empty()
          expect(intent.entities).to.have.property('country')
          expect(intent.entities).to.have.property('greetings')
          const bestMatch = intent.maxConfidence()
          expect(bestMatch).to.have.property('confidence')
          expect(bestMatch).to.have.property('value')
          expect(bestMatch).to.have.property('entity')
        }).catch(e => {
          expect(e).to.not.be.ok()
        })
      })
    })
    describe('Test on a forgotten text', function () {
      it('Should respond by an Intent Object containing greeting', function () {
        const options = {
          context: {
            locale: 'en_US'
          },
          n: 1 // returns up to 4 possible intents
        }
        return wit.message('Hi This is meant to be unlearned', options).then((intent) => {
          expect(intent).to.be.an(Intent)
          expect(intent).to.have.property('entities')
          expect(intent.entities).not.to.be.empty()
          expect(intent.entities).to.have.property('greetings')
          expect(intent.entities).not.to.have.property('country')
        }).catch(e => {
          expect(e).to.not.be.ok()
        })
      })
    })
  })

  describe('Speech', function () {
    it('Should respond by an Intent Object', function () {
      return wit.speech('./test/sample.wav').then((intent) => {
        expect(intent).to.be.an(Intent)
        expect(intent._test).to.be('hello')
        expect(intent.entities).not.to.be.empty()
        expect(intent.entities).to.have.property('wit$greetings')
        const bestMatch = intent.maxConfidence()
        console.log(bestMatch)
        expect(bestMatch).to.have.property('confidence')
        expect(bestMatch).to.have.property('value')
        expect(bestMatch).to.have.property('entity')
      }).catch(e => {
        expect(e).to.not.be.ok()
      })
    })
  })
  
  describe('App Management', function () {
    let newWit = {}
    let appId = ''
    describe('Get all apps', function () {
      it('Should return list of apps', function () {
        return wit.app.list().then(apps => {
          const found = apps.find(app => app.name === 'tempApp')
          appId = found ? found.id : ''
          expect(apps).to.be.an(Array)
          expect(apps).not.to.be.empty()
          expect(apps[0]).to.be.an(App)
        }).catch(e => {
          expect(e).to.not.be.ok()
        })
      })
    })

    describe('Add a new app', function () {
      before(function () {
        if (appId) {
          return wit.app.delete(appId).then(res => {
          }).catch(e => {
          })
        }
      })
      it('Should add an app', function () {
        return wit.app.add('tempApp', false, 'en', 'temporary app').then(app => {
          expect(app).to.be.an(App)
          expect(app.id).not.to.be.empty()
          newWit = new Wit(app.token)
          appId = app.id
          expect(app.name).to.be('tempApp')
        }).catch(e => {
          expect(e).to.not.be.ok()
        })
      })
    })

    describe('Newly created app has it is own wit instance', function () {
      it('should only return default built-in entities', function () {
        return newWit.entity.list().then((entities) => {
          expect(entities).to.be.an(Array)
          expect(entities).not.to.be.empty()
          expect(entities[0]).to.be.an(Entity)
          const entityName = entities.map(entity => entity.name)
          expect(entityName).to.contain('wit$greetings')
          expect(entityName).not.to.contain('country')
        }).catch(e => {
          expect(e).to.not.be.ok()
        })
      })
    })

    describe('Update an App', function () {
      it('Should update an App', function () {
        return newWit.app.update(appId, { private: true }).then((res) => {
          expect(res).to.be.ok()
          expect(res.success).to.be(true)
        }).catch(e => {
          expect(e).to.not.be.ok()
        })
      })
    })

    describe('Delete an App', function () {
      describe('Delete the newly created app', function(){
        it('Should delete the App and respond by success: true', function () {
          return newWit.app.delete(appId).then((res) => {
            expect(res).to.be.ok()
            expect(res.success).to.be(true)
          }).catch(e => {
            expect(e).to.not.be.ok()
          })
        })
      })

      describe('The latest wit instance shall not work', function(){
        it('Should trigger error', function () {
          return newWit.entity.get('intent').then((entity) => {
            expect(entity).not.to.be.ok()
          }).catch(e => {
            expect(e).to.be.an(Error)
            expect(e).to.have.property('code')
            expect(e.code).to.be('not-found' || 'no-auth')
            expect(e.message).not.to.be.empty()
          })
        })
      })
    })
  })
  
  const defectedWit = new Wit('cant be a token')
  describe('Error handeling', function () {
    describe('Api fails', function () {
      it('Should fail & return Error instance with a message and code props', function () {
        return defectedWit.entity.list().then(entities => {
          console.log(entities)
        }).catch(e => {
          expect(e).to.be.an(Error)
          expect(e).to.have.property('code')
          expect(e.code).to.be('unknown')
          expect(e.message).not.to.be.empty()
        })
      })
    })
    describe('Api errors', function () {
      it('Should fail & return Error instance with a message and code props', function () {
        return wit.entity.delete('cantbe_an_entity').then(entity => {
          console.log(entity)
        }).catch(e => {
          expect(e).to.be.an(Error)
          expect(e).to.have.property('code')
          expect(e.code).to.be('not-found')
          expect(e.message).not.to.be.empty()
        })
      })
    })
  })
})
