import axios from "axios";
import { Transform, Writable } from 'stream'

const url = 'http://localhost:3000'

async function consume () {
    const response = await axios({
        url,
        method: 'get',
        responseType: 'stream' //informa que ele não precisa esperar a informação chegar
    })

    return response.data
}

const stream = await consume()

stream.pipe(new Transform({ //filtro para dizer qual é impa e qual é par
    transform(chunk, enc, cb) {
        const item = JSON.parse(chunk)

        const myNumber = /\d+/.exec(item.name)[0]

        let name = item.name

        if(myNumber % 2 === 0) name = name.concat(' é par')
        else name = name.concat(' é impar')

        item.name = name

        cb(null, JSON.stringify(item))
    }
}))

.pipe(new Transform({ //outro filtro de dados
    transform(chunk, enc, cb) {
        const secondFilter = chunk.toString().toUpperCase()

        cb(null, secondFilter)
    }
}))

.pipe(new Writable({ // esse pipe já entrega o arquivo finalizado
    write(chunk, enc, cb) {
        console.log('já chegou o disco voadoorr ', chunk.toString())

        cb()
    }
}))