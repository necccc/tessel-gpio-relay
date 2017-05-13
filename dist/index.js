'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events');

var ERR_INVALIDCHANNEL = "Invalid relay channel.";

var HIGH = 1;
var LOW = 0;

var Relay = function (_EventEmitter) {
    _inherits(Relay, _EventEmitter);

    function Relay(port, channels) {
        var switchState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'low';
        var callback = arguments[3];

        _classCallCheck(this, Relay);

        var _this = _possibleConstructorReturn(this, (Relay.__proto__ || Object.getPrototypeOf(Relay)).call(this));

        if (typeof switchState === 'function') {
            callback = arguments[2];
            switchState = 'low';
        }

        _this.port = port;
        _this.channels = channels;

        _this.ON = LOW;
        _this.OFF = HIGH;

        if (switchState === 'high') {
            _this.ON = HIGH;
            _this.OFF = LOW;
        }

        _this.channelStates = channels.reduce(function (obj, channel) {
            obj[channel] = false;
            _this.setPin(channel, _this.OFF);
            return obj;
        }, {});

        setImmediate(function () {
            _this.emit('ready');
            if (callback) {
                callback(null, _this);
            }
        });
        return _this;
    }

    _createClass(Relay, [{
        key: 'setPin',
        value: function setPin(channel, value) {
            var relay = this.port.pin[channel - 1];
            relay.write(value);
        }
    }, {
        key: 'setRawValue',
        value: function setRawValue(channel, state, callback) {
            var _this2 = this;

            var silent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

            var value = state ? this.ON : this.OFF;
            this.setPin(channel, value);

            this.channelStates[channel] = value;

            if (callback) {
                callback(null);
            }

            if (!silent) {
                setImmediate(function () {
                    _this2.emit('latch', channel, state);
                });
            }
        }
    }, {
        key: 'isInvalidChannel',
        value: function isInvalidChannel(channel) {
            return !(channel !== 0 && channel <= this.channels.length);
        }
    }, {
        key: 'getState',
        value: function getState(channel, callback) {
            if (this.isInvalidChannel(channel)) {
                return callback && callback(new Error(ERR_INVALIDCHANNEL));
            }

            var state = this.channelStates[channel] === this.ON ? true : false;

            callback && callback(null, state);
        }
    }, {
        key: 'setState',
        value: function setState(channel, state, callback) {
            if (this.isInvalidChannel(channel)) {
                return callback && callback(new Error(ERR_INVALIDCHANNEL));
            }

            this.setRawValue(channel, state, callback);
        }
    }, {
        key: 'toggle',
        value: function toggle(channel, callback) {
            var _this3 = this;

            this.getState(channel, function (err, state) {
                if (err) {
                    return callback && callback(err);
                }
                _this3.setRawValue(channel, !state, callback);
            });
        }
    }, {
        key: 'turnOn',
        value: function turnOn(channel, callback) {
            if (this.isInvalidChannel(channel)) {
                return callback && callback(new Error(ERR_INVALIDCHANNEL));
            }

            this.setRawValue(channel, true, callback);
        }
    }, {
        key: 'turnOff',
        value: function turnOff(channel, callback) {
            if (this.isInvalidChannel(channel)) {
                return callback && callback(new Error(ERR_INVALIDCHANNEL));
            }

            this.setRawValue(channel, false, callback);
        }
    }]);

    return Relay;
}(EventEmitter);

var use = function use(port, channels, callback) {
    return new Relay(port, channels, callback);
};

module.exports = {
    use: use,
    Relay: Relay
};