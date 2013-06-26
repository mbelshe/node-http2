var expect = require('chai').expect

var compressor = require('../lib/compressor')
  , Compressor = compressor.Compressor
  , Decompressor = compressor.Decompressor

var test_integers = [{
  N: 5,
  I: 10,
  buffer: new Buffer([10])
}, {
  N: 5,
  I: 1337,
  buffer: new Buffer([31, 128 + 26, 10])
}]

// Concatenate buffers into a new buffer
function concat(buffers) {
  var size = 0
  for (var i = 0; i < buffers.length; i++) size += buffers[i].length

  var concatenated = new Buffer(size)
  for (var cursor = 0, j = 0; j < buffers.length; cursor += buffers[j].length, j++) {
    buffers[j].copy(concatenated, cursor)
  }

  return concatenated
}

describe('Compressor', function() {
  describe('static function integer(I, N)', function() {
    it('should return an array of buffers that represent the N-prefix coded I value', function() {
      for (var i = 0; i < test_integers.length; i++) {
        var test = test_integers[i]
        expect(concat(Compressor.integer(test.I, test.N))).to.deep.equal(test.buffer)
      }
    })
  })
})

describe('Decompressor', function() {
  describe('static function integer(buffer, N)', function() {
    it('should return the parsed N-prefix coded number and increase the cursor property of buffer', function() {
      for (var i = 0; i < test_integers.length; i++) {
        var test = test_integers[i]
        test.buffer.cursor = 0
        expect(Decompressor.integer(test.buffer, test.N)).to.equal(test.I)
        expect(test.buffer.cursor).to.equal(test.buffer.length)
      }
    })
  })
})