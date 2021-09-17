const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const moment = require('moment'); 
const Contenedor = require('./src/contenedores/Contenedor.js')

const contChat = new Contenedor('./chat.txt')
const contProd = new Contenedor('./productos.txt')

const fecha = moment().format("DD/MM/YYYY HH:mm:ss"); 


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//contChat.start()
//contProd.start()
const mensajes = JSON.parse(contChat.getAll())
const productos= JSON.parse(contProd.getAll())

app.use(express.static('public'))

io.on('connection',async socket => {
    console.log('Nuevo cliente conectado!')

    /* Envio los mensajes al cliente que se conectó */
    socket.emit('mensajes', mensajes)

    /* Escucho los mensajes enviado por el cliente y se los propago a todos */
    socket.on('mensaje', data => {
        const msj = {fecha, mensaje: data }
        mensajes.push(msj)
        io.sockets.emit('mensajes', mensajes)
        contChat.save(msj)
    })

    socket.emit('productos', productos)

    socket.on('producto', data => {
        productos.push(data)
        io.sockets.emit('productos', productos)
        contProd.save(data)
    })
    
})

const PORT = 8080
const connectedServer = httpServer.listen(PORT, function () {
    console.log(`Servidor Http con Websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
