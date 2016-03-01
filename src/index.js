'use strict';

const JSONStream = require('JSONStream')
    , duplexify = require('duplexify')

function wrap(streams, opts) {
  const { fwd = [], inherit = [] } = opts || {}

  const writable = JSONStream.parse()
  const readable = JSONStream.stringify(false)

  streams = [writable].concat(streams).concat(readable)

  if (streams.length < 3) {
    throw new Error('wrap-json-stream requires at least one stream')
  }

  // I previously used pumpify, but a pumpify pipeline cannot be
  // in halfOpen state, so it's a bad match for this purpose
  const outer = duplexify(writable, readable, { allowHalfOpen: true })
  const destroy = outer.destroy.bind(outer)
  const readables = []

  function pipe(rs, ws) {
    readables.push(rs)
    return rs.once('error', destroy).pipe(ws).on('unpipe', unpipe)
  }

  function unpipe(rs) {
    const index = readables.indexOf(rs)

    if (index >= 0) {
      readables.splice(index, 1)

      // Hack to end outer readable stream when inner streams end early
      if (!readables.length && !outer._readableState.ended) {
        outer.setReadable(false)
      }
    }
  }

  streams.reduce(pipe)

  const inner = streams[1]

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

  return outer
}

module.exports = wrap
