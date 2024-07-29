// process.stdin
//   .pipe(process.stdout)

import { Readable, Writable, Transform } from 'node:stream'

class OneTOHundred extends Readable {
  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null)
        return
      } else {
        const buf = Buffer.from(i + '\n')
        this.push(buf)
      }
    }, 1000)
  }
}

class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(parseInt(chunk.toString()) * 10)
    callback()
  }
}

class InverseNumber extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = parseInt(chunk.toString()) * -1

    callback(null, Buffer.from(String(transformed)))
  }
}

new OneTOHundred()
  .on('data', (chunk) => console.log(String(chunk)))
  .pipe(new InverseNumber())
  .pipe(new MultiplyByTenStream())