const EventEmitter = require('events')

const ERR_INVALIDCHANNEL = "Invalid relay channel."

const HIGH = 1
const LOW = 0

class Relay extends EventEmitter {

    constructor (port, channels, switchState = 'low', callback) {
        super()

        if (typeof switchState === 'function') {
            callback = arguments[2]
            switchState = 'low'
        }

        this.port = port
        this.channels = channels

        this.ON = LOW
        this.OFF = HIGH

        if (switchState === 'high') {
            this.ON = HIGH
            this.OFF = LOW
        }

        this.channelStates = channels.reduce((obj, channel) => {
            obj[channel] = false
            this.setPin(channel, this.OFF)
            return obj;
        }, {})

        setImmediate(() => {
            this.emit('ready')
            if (callback) {
                callback(null, this)
            }
        })
    }

    setPin (channel, value) {
        var relay = this.port.pin[channel - 1];
        relay.write(value);
    }

    setRawValue (channel, state, callback, silent = false) {
        var value = (state ? this.ON : this.OFF)
        this.setPin(channel, value)

        this.channelStates[channel] = value;

        if (callback) {
            callback(null);
        }

        if (!silent) {
            setImmediate(() => {
                this.emit('latch', channel, state);
            });
        }
    }

    isInvalidChannel (channel) {
        return !(channel !== 0 && channel <= this.channels.length)
    }

    getState (channel, callback) {
        if (this.isInvalidChannel(channel)) {
            return callback && callback(new Error(ERR_INVALIDCHANNEL));
        }

        var state = this.channelStates[channel] === this.ON ? true : false;

        callback && callback(null, state);
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

        this.setRawValue(channel, true, callback)
    }

    turnOff (channel, callback) {
        if (this.isInvalidChannel(channel)) {
            return callback && callback(new Error(ERR_INVALIDCHANNEL));
        }

        this.setRawValue(channel, false, callback)
    }

}

const use = (port, channels, callback) => {
    return new Relay(port, channels, callback)
}

module.exports = {
    use,
    Relay
}