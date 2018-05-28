# wit-api
wit-api is a node package that allows you to easily configure and train your NLP through Wit.ai HTTP API.

Note that wit-api uses `promises`, so be aware to always `catch` at least once when implementing your code.

## Installation
```bash
npm install wit-api
```

## Initialisation
```Javascript
const Wit = require('wit-api')

const wit = new Wit('<YOUR-SERVER-ACCESS-TOKEN>')
```

## Message
```Javascript
wit.message('Wake me up when septembre end!').then((intent) => {
  // intent is an instance of Entity
  console.log(intent)
  // We can call Entity methods cuch as `.maxConfidence()`
  // Here we are getting the entity with the highest confidence score
  const bestMatch = intent.maxConfidence()
  console.log(bestMatch)
}).catch((error) => {
  console.error(error)
})
```
**Message with context and thread**
```Javascript
const options = {
  context: {
    timezone: 'America/Los_Angeles',
    locale: 'en_GB'
  },
  thread_id: '100',
  n: 4 // returns up to 4 possible intents
}
wit.message('Wake me up when september end!', options).then((intent) => {
  // intent, as an instance of Entity, still holds the context and the thread for later use
  console.log(intent)
  // Here we are getting entity with the highest confidence score
  const bestMatch = intent.maxConfidence()
  console.log(bestMatch)
}).catch((error) => {
  console.error(error)
})
```

## Speech
The audio file must have a duration no longer than 10 sec.

The supported formats are as follows:
- audio/wav RIFF WAVE (linear, little-endian).
- audio/mpeg3 for mp3
- audio/ulaw for G.711 u-law file or stream. Sampling rate must be 8khz
- audio/raw with mandatory [parameters](parameters)

Thus after some heavy testing it seems that wav is the most stable and best matching, we recommand to convert your dataset to wave (linear, little-endian) for better results. You can use [sox](sox) to record new data.
```bash
$ sox -d -b 16 -c 1 -r 16k sample.wav
# ctrl+C to stop the recording
```

```Javascript
wit.speech('/path/to/my5secSpeech.wav').then((intent) => {
  // intent Object is returned
  console.log(intent)
}).catch((error) => {
  console.error(error)
})
```
## Entity instance
You can create a local entity instance:
```Javascript
const myEntity = wit.entity('played_games')
```
You can then sync the entity with the API:
```Javascript
myEntity.sync().then(() => {
  // Synchonized entity
  console.log(myEntity)
})
// or in one line
const myEntity = wit.entity('played_games').sync().then(() => {
  // sync-ked !
})
```
To update the entity you can call the `.save()` method:
```Javascript
myEntity.doc = 'Video games I played'
myEntity.save().then(() => {
  console.log(myEntity)
})
```

## Training
The training happens on an EntityValue level, so you need to have an entity having at least one value. Then you can send text to indicate that it matches the EntityValue.

Additionaly if you are capturing relevant data, you can indicate where the relevant portion starts and ends.
```Javascript
wit.train('I enjoyed playing MGS2 while eating pizza', {
  [
    {
      entity: "played_games",
      value: "Metal_Gear_Solid_2"
      start: 17,
      end: 21
    },
    {
      entity: "favorit_food",
      value: "pizza"
    }
  ]
})
```

## Entity Value Expression
### Entities
#### Get all entities of the app
```Javascript
wit.entity.list().then((entities) => {
  // Returns a list of all entities (Including Built-in entities)
  console.log(entities)
})
```

#### Create a new entity
```Javascript
wit.entity.add('played_games', 'Video games I played').then((entity) => {
  // Returns the entity instance `played_games`
  console.log(entity)
})
```

#### Get an entity
```Javascript
wit.entity.get('played_games').then((entity) => {
  // returns the same entity instance as previous example
  console.log(entity)
})
```
Which is equivalent to `wit.entity('played_games').sync()`

#### Update an entity
```Javascript
const changes = {
  values: [
    {
      value: 'Metal_Gear_Solid_2',
      expressions: [
        'metal gear 2',
        'mgs2',
        'sons of liberty'
      ],
      metadata: {game_id: 3, release_date: 2001}
    }
  ]
}
wit.entity.update('played_games', changes).then((entity) => {
  console.log(entity)
})
```

#### Delete an entity (permanently)
```Javascript
wit.entity.delete('played_games').then((res) => {
  console.log('Deleted!')
})
```
### Values
#### Add an entity value
```Javascript
wit.value.add('played_games', 'Metal_Gear_Solid_2').then((entity) => {
  // This does also return an entity instance
  console.log(entity)
})
```
#### Delete a Value
```Javascript
wit.value.delete('Metal_Gear_Solid_2').then((res) => {
  console.log('Deleted!')
})
```
### Expressions
#### Add an expression
```Javascript
wit.expression.add('played_games', 'Metal Gear Solid 2', 'mgs2').then((entity) => {
  // Yet still returns an entity instance
  console.log(entity)
})
```
#### Delete an expression
```Javascript
wit.expression.delete('mgs2').then((res) => {
  console.log('Deleted!')
})
```

## Managing Apps
#### List all your apps
```Javascript
wit.app.list().then((myApps){
  // Array of all app instances
  console.log(myApps)
})
```
#### Add a new app
```Javascript
// wit.app.add(appname, private, language, description)
wit.app.add('myNewApp', true, 'en', 'Brand new App').then((myNewApp) => {
  // the returned myNewApp uses a new token and has same methods as the `wit` object
  myNewApp.entities.list().then((entities) => {
    // This will return the list of wit's built-in entities, since we did not create one yet
    console.log(entities)
  })
})
```
#### Update an app
```Javascript
wit.update(myNewApp.id, {private = false}).then(() => {
  // updated app
  console.log(myNewApp)
})
```
#### Delete an app (permanently)
```Javascript
wit.delete(myNewApp.id).then((res) => {
  console.log('Permanently deleted')
})
```
