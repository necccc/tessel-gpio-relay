var relaylib = require('./dist/index')
var tessel = require('tessel')


var channels = [1,2,3,4]
var nextChannel = (function () {
    var currentIndex = 0;

    return function () {
        var current = currentIndex

        if (channels[currentIndex + 1]) {
            currentIndex += 1
        } else {
            currentIndex = 0
        }

        return channels[current]
    }
}())

var relay = relaylib.use(tessel.port['B'], channels)

relay.on('ready', function () {

    console.log('relay ready')

    setInterval(function () {
        var channel = nextChannel()

        console.log('test toggle', channel)

        relay.toggle(channel)

    }, 400)

})

