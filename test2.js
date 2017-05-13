var relaylib = require('./dist/index')
var tessel = require('tessel')


var channels = [1,2]

var relay = relaylib.use(tessel.port['B'], channels)

relay.on('latch', function () {
    console.log('latch', arguments)
})

relay.on('ready', function () {

    console.log('relay ready')

    setTimeout(function () {
        relay.toggle(1)
    }, 1000)

    setInterval(function () {


        //console.log('test toggle', channel)



    }, 400)
})

