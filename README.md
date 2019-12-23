# wit-api
wit-api is a node package that allows you to easily configure, train and consume your NLP through Wit.ai HTTP API.

**Note**: This is the version 1.x.y, it has no dependency, and it uses `promises`.

**Note**: Version 1.0.0 is stable, and will recieve only additional utils methods

## Installation
```bash
npm i wit-api --save
```

## Initialization
```javascript
const Wit = require('./src/Wit')

async function run () {
  try {
    // Instantiation
    const wit = new Wit('<YOUR-SERVER-ACCESS-TOKEN>')
    // Syncronize with remote
    await wit.sync()
  } catch (e) {
    console.error(e)
  }
}

run()
```
Additionally, you can pass options to the instantiation, like:
`new Wit('<YOUR-SERVER-ACCESS-TOKEN>', { debug: true, timeout: 30000, version: '20170307'})`

- debug: will display more insights about the http requests
- timeout: in milliseconds, indicate when the http request times-out
- version: indicate what version of wit.ai to use, **this lib ain't work for versions prior to 20170307**

## Entities, Vlaues & Expressions
```javascript
async function run () {
  try {
    const wit = new Wit('<YOUR-SERVER-ACCESS-TOKEN>')
    await wit.sync()
    // Adding a new entity
    await wit.entities.add('cloth')
    // The newly added entity is sync-ed in the `wit` object
    // and can be accessed through `wit.entities.cloth`

    // For script reusability, it is recomended check the entity existance before adding it
    if (!wit.entities.size) {
      await wit.entities.add('size')
    }

    // Update an entity
    await wit.entities.cloth.update({ doc: 'An item from the store', lookups: ['keywords'] })

    // We can also manipulate the entities values and expression through the `.update` function
    // Also additional options are present, like metadata
    await wit.entities.size.update({
      doc: 'Size',
      lookups: ['free-text', 'keywords'],
      values: [
        {value: 'extra small', expressions: ['36'], metadata: 'XS'},
        {value: 'small', expressions: ['37', '38'], metadata: 'S'},
        {value: 'medium', expressions: ['39', '40'], metadata: 'M'},
        {value: 'large', expressions: ['41', '42'], metadata: 'L'},
        {value: 'extra large', expressions: ['43', '44'], metadata: 'XL'}
      ]
    })

    // Deleting an entity
    await wit.entities.cloth.destroy()
  } catch (e) {
    console.error(e)
  }
}

run()
```
## Training
```javascript
// This goes insde an `async function`
await wit.services.sample.train([
  {
    text: 'I would like to have a jean please.',
    entities: [
      {
        entity: 'intent',
        value: 'order'
      },
      {
        entity: 'product',
        value 'pant',
        start: '22',
        end: '26'
      }
    ]
  }
])
// wit.service.sample.train can take multiples training sample

// You can reverse a training by using .forget
await wit.services.sample.forget([
  {text: 'I would like to have a jean please.'}
])
```
## Guessing (text & speech)
This is actually where we use the api for understanding

All the guess methods retuen a Guess Object
```javascript
// this goes inside an `async function`

// Text:
const guess = await wit.services.guess.message('I want to try a coton black shirt, preferably size 43')
console.log(guess)
/* example of a result:
{ _text: 'I want to try a coton black shirt, preferably size 43',
  entities:
   { product: [ { confidence: 1, value: 'shirt', type: 'value' } ],
     shirtTextile: [ { confidence: 1, value: 'coton', type: 'value' } ],
     color:
      [ { metadata: '#000000',
          confidence: 1,
          value: 'black',
          type: 'value' } ],
     size: [ { confidence: 1, value: 'XL', type: 'value' } ],
     intent: [ { confidence: 0.72456770482335, value: 'try' } ] },
  msg_id: '1AY90y2ewdQhotazg'
}
*/

// Language:
await wit.services.guess.language('je m\'appel foobar')

// You can also have both language guessing and text guessing by using
await wit.services.guess.all('I want to try a coton black shirt, preferably size 43')

// Audio:
await wit.services.guess.speech('path/to/an/audio/file.wav')
```
Both `.message` and `.speech` can take additional options, in like the following
```javascript
const options = {n: 5}
await wit.services.guess.message(text, options)
```
More about these options at https://wit.ai/docs/http/20170307#get__message_link

## Guess Methods
Once the guessing service was called, it returns a Guess Object, theses objects have utils methods.

For instance to return only relevant guesses (with confidance above 0.95)
```javascript
const guess = await wit.services.guess.all('I want to try a coton black shirt, preferably size 43', {n: 5})
console.log(guess.bestGuesses(.95))
/* 
would print:
{
  "shirtTextile": {"confidence": 1, "value": "coton", "type": "value"},
  "color": {"metadata": "#000000", "confidence": 1, "value": "black", "type": "value"},
  "product": {"confidence": 1, "value": "shirt", "type": "value"},
  "size": {"confidence": 1, "value": "XL", "type": "value"},
  "intent": {"confidence": 0.98808266775175, "value": "request"},
  "language": {"locale": "en_XX", "confidence": 1}
}
*/

// Additionally you can filter and softfilter guessing results using:
guess.filter(.95)
guess.softFilter(1)
```

###### with love from Hexastack
