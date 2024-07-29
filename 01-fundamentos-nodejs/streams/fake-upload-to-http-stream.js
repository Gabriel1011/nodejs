import { Readable } from 'node:stream'

class OneTOHundred extends Readable {
  index = 1

  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 5) {
        this.push(null)
        return
      } else {
        const buf = Buffer.from(i + '\n')
        this.push(buf)
      }
    }, 1000)
  }
}

fetch('http://localhost:3334', {
  method: 'POST',
  body: new OneTOHundred(),
  duplex: 'half'
}).then(response => response.text().then(data => console.log(data)))