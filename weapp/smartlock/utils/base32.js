var MinaOTP = function(options) {
  var construct,
    // options
    pad,
    dataBits,
    codeBits,
    keyString,
    arrayData,
    // private instance variables
    mask,
    group,
    max,
    // private methods
    gcd,
    translate,
    // public methods
    encode,
    decode

  // pseudo-constructor
  construct = function() {
    var i, mag, prev

    // options
    pad = options.pad || ''
    dataBits = options.dataBits
    codeBits = options.codeBits
    keyString = options.keyString
    arrayData = options.arrayData

    // bitmasks
    mag = Math.max(dataBits, codeBits)
    prev = 0
    mask = []
    for (i = 0; i < mag; i += 1) {
      mask.push(prev)
      prev += prev + 1
    }
    max = prev

    // ouput code characters in multiples of this number
    group = dataBits / gcd(dataBits, codeBits)
  }

  // greatest common divisor
  gcd = function(a, b) {
    var t
    while (b !== 0) {
      t = b
      b = a % b
      a = t
    }
    return a
  }

  // the re-coder
  translate = function(input, bitsIn, bitsOut, decoding) {
    var i, len, chr, byteIn, buffer, size, output, write

    // append a byte to the output
    write = function(n) {
      if (!decoding) {
        output.push(keyString.charAt(n))
      } else if (arrayData) {
        output.push(n)
      } else {
        output.push(String.fromCharCode(n))
      }
    }

    buffer = 0
    size = 0
    output = []

    len = input.length
    for (i = 0; i < len; i += 1) {
      // the new size the buffer will be after adding these bits
      size += bitsIn

      // read a character
      if (decoding) {
        // decode it
        chr = input.charAt(i)
        byteIn = keyString.indexOf(chr)
        if (chr === pad) {
          break
        } else if (byteIn < 0) {
          throw 'the character "' + chr + '" is not a member of ' + keyString
        }
      } else {
        if (arrayData) {
          byteIn = input[i]
        } else {
          byteIn = input.charCodeAt(i)
        }
        if ((byteIn | max) !== max) {
          throw byteIn + ' is outside the range 0-' + max
        }
      }

      // shift the buffer to the left and add the new bits
      buffer = (buffer << bitsIn) | byteIn

      // as long as there's enough in the buffer for another output...
      while (size >= bitsOut) {
        // the new size the buffer will be after an output
        size -= bitsOut

        // output the part that lies to the left of that number of bits
        // by shifting the them to the right
        write(buffer >> size)

        // remove the bits we wrote from the buffer
        // by applying a mask with the new size
        buffer &= mask[size]
      }
    }

    // If we're encoding and there's input left over, pad the output.
    // Otherwise, leave the extra bits off, 'cause they themselves are padding
    if (!decoding && size > 0) {
      // flush the buffer
      write(buffer << (bitsOut - size))

      // add padding keyString for the remainder of the group
      len = output.length % group
      for (i = 0; i < len; i += 1) {
        output.push(pad)
      }
    }

    // string!
    return arrayData && decoding ? output : output.join('')
  }

  /**
   * Encode.  Input and output are strings.
   */
  encode = function(input) {
    return translate(input, dataBits, codeBits, false)
  }

  /**
   * Decode.  Input and output are strings.
   */
  decode = function(input) {
    return translate(input, codeBits, dataBits, true)
  }

  this.encode = encode
  this.decode = decode
  construct()
}

var Base32 = new MinaOTP({
  dataBits: 8,
  codeBits: 5,
  keyString: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
  pad: '='
})
var Base64 = new MinaOTP({
  dataBits: 8,
  codeBits: 6,
  keyString: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  pad: '='
})

module.exports = {
  encode: Base32.encode,
  decode: Base32.decode
}
