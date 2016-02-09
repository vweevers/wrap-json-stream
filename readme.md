# wrap-json-stream

**Wrap a duplex stream with JSONStream parse and stringify.**

[![npm status](http://img.shields.io/npm/v/wrap-json-stream.svg?style=flat-square)](https://www.npmjs.org/package/wrap-json-stream) [![Dependency status](https://img.shields.io/david/vweevers/wrap-json-stream.svg?style=flat-square)](https://david-dm.org/vweevers/wrap-json-stream)

## example

```js
const json = require('wrap-json-stream')
    , through2 = require('through2')

const wrapped = json(through2.obj(function(obj, _, next){
  obj.y = obj.x*2
  next(null, obj)
}))

wrapped.on('data', (data) => console.log(data.toString()))
wrapped.write('{"x":1}\n{"x":2}')
```

```
{"x":1,"y":2}

{"x":2,"y":4}
```

## `json(stream(s), [opts])`

Options:

- **fwd**: array of events to forward from the inner stream to the outer
- **inherit**: array of properties to inherit

```js
const inner = someStream()
inner.name = 'my-stream'

const outer = json(inner, { inherit: ['name'], fwd: ['sync'] })

outer.on('sync', () => console.log(outer.name))
inner.emit('sync')
```

## install

With [npm](https://npmjs.org) do:

```
npm install wrap-json-stream
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
