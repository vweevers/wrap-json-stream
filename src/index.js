'use strict';

const pumpify = require('pumpify')
    , JSONStream = require('JSONStream')

function wrap(streams, opts) {
  const { fwd = [], inherit = [] } = opts || {}

  streams = [].concat(streams)
  const inner = streams[0]

  streams.unshift(JSONStream.parse())
  streams.push(JSONStream.stringify(false))

  const outer = pumpify(streams)

  if (inner) {
    // Forward non-stream events
    fwd.forEach(function(event) {
      inner.on(event, function(data) {
        outer.emit(event, data)
      })
    })

    // Inherit metadata
    inherit.forEach(function(p) {
      if (inner[p] != null) outer[p] = inner[p]
    })
  }

  return outer
}

module.exports = wrap
