# wit-api
Wit-api allow you to easily configure and train your NLP.

It uses `promises` so be aware to always `catch` at least once when implementing your code.
## Installation
```bash
npm install wit-api
```

## Initialisation
```Javascript
const Wit = require('wit-api')

const wit = new Wit('xxxxxxxxYour-Access-Tokenxxxxxxxxx')
```

## Message
```Javascript
wit.message('Wake me up when septembre end!').then((intent) => {
  // intent Object is returned
  console.log(intent)
  // intent has it's methods, here we are getting entity with the highest confidance
  const bestMatch = intent.maxConfidence()
  console.log(bestMatch)
}).catch((error) => {
  console.error(error)
})
```
**message with context and thread**
```Javascript
const options = {
  context: {
    timezone: 'America/Los_Angeles',
    locale: 'en_GB'
  },
  thread_id: '100',
  n: 4 // return up to 4 intent possible
}
wit.message('Wake me up when septembre end!', options).then((intent) => {
  // intent Object still holds the context and the thread for later use
  console.log(intent)
  // intent has it's methods, here we are getting entity with the highest confidance
  const bestMatch = intent.maxConfidence()
  console.log(bestMatch)
}).catch((error) => {
  console.error(error)
})
```

## Speech
The audio file must be not longer than 10 sec

The supported formats are
- audio/wav RIFF WAVE (linear, little-endian).
- audio/mpeg3 for mp3
- audio/ulaw for G.711 u-law file or stream. Sampling rate must be 8khz
- audio/raw with mandatory [parameters](parameters)

Thus after some heavy testing it seems that wav is the most stable and best matching, we recommand to convert your dataset to wave (linear, little-endian) for better results, also if you are recording new data you can use [sox](sox)
```bash
$ sox -d -b 16 -c 1 -r 16k sample.wav
# ctrl+C to end the recording
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
You can then sync with the api:
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
To update the entity you can call the `save` method:
```Javascript
myEntity.doc = 'Video games I played'
myEntity.save().then(() => {
  console.log(myEntity)
})
```
To create an entity and commit it you also have to call the `save` method:
```Javascript
const commitedEntity = wit.entity('favorit_food').save().then(() => {
  console.log(commitedEntity)
})
```

## Training
The training happens on an EntityValue level, so you need to have at least one entity that have one value. Then you can send text to indicate that it matchs the EntityValue.

Additionaly if you are capturing relevant data you can indicate where the relevant portion starts and ends.
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
  // retuens a list of enitity instances
  console.log(entities)
})
```

#### Create a new entity
```Javascript
wit.entity.add('played_games', 'Video games I played').then((entity) => {
  // return entity instance
  console.log(entity)
})
```
Which is equivalant to `wit.entity('played_games', {doc: 'Video games I played'}).save()`

#### Get an entity
```Javascript
wit.entity.get('played_games').then((entity) => {
  // return the same entity instance as previous example
  console.log(entity)
})
```
Which is equivalant to `wit.entity('played_games').sync()`

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

#### Permanently delete an entity
```Javascript
wit.entity.delete('played_games').then((res) => {
  console.log('Deleted!')
})
```
### Values
#### Add a value
```Javascript
wit.value.add('played_games', 'Metal_Gear_Solid_2').then((enitity) => {
  // this does also return an entity instance
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
  // yet still return an entity instance
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
  // array of apps instances
  console.log(myApps)
})
```
#### Add a new app
```Javascript
// wit.app.add(appname, private, language, description)
wit.app.add('myNewApp', true, 'en', 'Brand new App').then((myNewApp) => {
  // the returned myNewApp uses a new token and has same methods as wit
  myNewApp.entities.list().then((entities) => {
    // list of default wit's entities
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
#### Permanently delete an app
```Javascript
wit.delete(myNewApp.id).then((res) => {
  console.log('Permanently deleted')
})
```
