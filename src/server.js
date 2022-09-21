import http from 'http'
import { Readable } from 'stream'
import { randomUUID } from 'crypto'

// chamado de generator ou seja função sob demanda
function* run () { //o asterisco significa que a função não vai espera gerar tudo, ela vai passar pra frente o que já existe
    for(let index = 0; index <= 99; index++) {
        const data = {
            id: randomUUID(),
            name: `Eliaquin-${index}`
        }

        yield data //aqui ele faz um return porem ele não espera o for finalizar, os dados que ele já tem processado ele passa pra frente
    }
}

async function handler(req, res) {
    const readble = new Readable({
        read() {
            //sempre trabalhamos com string
            for(const data of run()) { // a medida que o for da função run retornar dados pra mim vou executando abaixo
                console.log(`sending: `, data)
                this.push(JSON.stringify(data) + '\n')
            }

            //para informar que os dados acabaram
            this.push(null)
        }
    })

    //cada pipe e para mandar para um processo ou um transform, uma função
    readble.pipe(res)
}

http.createServer(handler)
.listen(3000)
.on('listening', () => console.log('server running at 3000'))