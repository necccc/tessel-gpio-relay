const EventEmitter = require('events')

const ERR_INVALIDCHANNEL = "Invalid relay channel."
const HIGH = 1
const LOW = 0

class Relay extends EventEmitter {

    constructor (port, channels, callback) {
        super()

        this.port = port
        this.channels = channels

        this.channelStates = channels.reduce((obj, channel) => {
            obj[channel] = false
            return obj;
        }, {})

        // Emit the ready event
        setImmediate(() => {
            this.emit('ready')
            if (callback) {
                callback(null, this)
            }
        })
    }

    setRawValue (channel, state, callback) {
        var relay = this.port.pin[channel - 1];
        var value = (state ? HIGH : LOW)
        // Set the value of that gpio
        relay.write(value);

        // Set our current state vars
        this.channelStates[channel] = value;

        // Call the callback
        if (callback) {
            callback(null);
        }

        // Set the event
        setImmediate(() => {
            this.emit('latch', channel, state);
        });

    }

    isInvalidChannel (channel) {
        return !(channel !== 0 && channel <= this.channels.length)
    }

    getState (channel, callback) {
        if (this.isInvalidChannel(channel)) {
            console.log('getState - invalid channel', channel)
            return callback && callback(new Error(ERR_INVALIDCHANNEL));
        }

        callback && callback(null, this.channelStates[channel]);
    }

    setState (channel, state, callback) {
        if (this.isInvalidChannel(channel)) {
            return callback && callback(new Error(ERR_INVALIDCHANNEL));
        }

        this.setRawValue(channel, state, callback)
    }

    toggle (channel, callback) {
        this.getState(channel, (err, state) => {
            if (err) {
                return callback && callback(err);
            }
            this.setRawValue(channel, !state, callback)
        })
    }

    turnOn (channel, callback) {
        if (this.isInvalidChannel(channel)) {
            return callback && callback(new Error(ERR_INVALIDCHANNEL));
        }

        this.setRawValue(channel, HIGH, callback)
    }

    turnOff (channel, callback) {
        if (this.isInvalidChannel(channel)) {
            return callback && callback(new Error(ERR_INVALIDCHANNEL));
        }

        this.setRawValue(channel, LOW, callback)
    }

}

const use = (port, channels, callback) => {
    return new Relay(port, channels, callback)
}

module.exports = {
    use,
    Relay
}