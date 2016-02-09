const json = require('./')
    , through2 = require('through2')

const wrapped = json(through2.obj(function(obj, _, next){
  obj.y = obj.x*2
  next(null, obj)
}))

wrapped.on('data', (data) => console.log(data.toString()))
wrapped.write('{"x":1}\n{"x":2}')
