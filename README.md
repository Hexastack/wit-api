# wit-api

## Initialisation
```Javascript
const Wit = require('wit-api')

const wit = new Wit('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
```

## Message
```Javascript
wit.message('Wake me up when septembre end!').then(message) => {
  console.log(message.entities)
}).catch(error) {
  console.error(error)
}
```