'use strict';

var pumpify = require('pumpify'),
    JSONStream = require('JSONStream');

function wrap(streams, opts) {
  var _ref = opts || {};

  var _ref$fwd = _ref.fwd;
  var fwd = _ref$fwd === undefined ? [] : _ref$fwd;
  var _ref$inherit = _ref.inherit;
  var inherit = _ref$inherit === undefined ? [] : _ref$inherit;

  streams = [].concat(streams);
  var inner = streams[0];

  streams.unshift(JSONStream.parse());
  streams.push(JSONStream.stringify(false));

  var outer = pumpify(streams);

  if (inner) {
    // Forward non-stream events
    fwd.forEach(function (event) {
      inner.on(event, function (data) {
        outer.emit(event, data);
      });
    });

    // Inherit metadata
    inherit.forEach(function (p) {
      if (inner[p] != null) outer[p] = inner[p];
    });
  }

  return outer;
}

module.exports = wrap;