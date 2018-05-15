# wit-api

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

## Entity Value Expression
Get all entities of the app
```Javascript
wit.entity.list().then((entities) => {
  // retuens a list of enitity instances
  console.log(entities)
})
```

Create a new entity
```Javascript
wit.entity.add('played_games', 'Video games I played').then((entity) => {
  // return entity instance
  console.log(entity)
})
```

Get an entity
```Javascript
wit.entity.get('played_games').then((entity) => {
  // return the same entity instance as previous example
  console.log(entity)
})
```

Update an entity
```Javascript
const changes = {
  values: [
    {
      value: 'Metal Gear Solid 2',
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

Permanently delete an entity
```Javascript
wit.entity.delete('played_games').then((res) => {
  console.log('Deleted!')
})
```
