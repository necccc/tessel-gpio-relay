# tessel-gpio-relay
JavaScript driver for Tessel, to connect with multi-port relays via GPIO

Using this mainly with SainSmart relays, which are a more sturdy and powerful alternatives to the default tessel relay module

## Installation

```
npm install tessel-gpio-relay
```

## Example


[![Video: Tessel2 drives a SainSmart 4-channel relay via GPIO](https://img.youtube.com/vi/yvArUpkDpZk/0.jpg)](https://www.youtube.com/watch?v=yvArUpkDpZk)

Should work roughly the same as Tessel's [relay-mono](https://github.com/tessel/relay-mono). The main difference, that you have to provide the pin addresses in an array, see below:

```js
var tessel = require('tessel');
var relaylib = require('tessel-gpio-relay'); 

var relay = relaylib.use(tessel.port['A'], [1,2]);  

relay.on('ready', function relayReady () {

  setInterval(function toggle() {
    
    relay.toggle(1, function toggleOneResult(err) {
      if (err) console.log("Err toggling 1", err);
    });
    
    relay.toggle(2, function toggleTwoResult(err) {
      if (err) console.log("Err toggling 2", err);
    });
    
  }, 2000);
  
});

relay.on('latch', function(channel, value) {
  console.log('latch on relay channel ' + channel + ' switched to', value);
});

```

### Configuration

#### channels {Array}

This module supports multi-channel relays, more than the default 2 on the tessel relay module.

You have to provide the pin addresses, to which the relay is connected in an array for the Relay instance.
Numeric addresses starting from 1, examples:

```js

// to use the official tessel relay module
var relay = relaylib.use(tessel.port['A'], [5,6]); 

// hook a 2 channel relay on pin 1,2
var relay = relaylib.use(tessel.port['A'], [1,2]); 

// hook a 4 channel relay on pin 1,2,3,4
var relay = relaylib.use(tessel.port['A'], [1,2,3,4]); 


```

#### switchState {String} 'high|low'

Some relays switch from default state when set to `high` value on the GPIO pins, and some are the opposite, they trigger switch state from default on the `low` value.

For example the official Tessel relay modules switch from default off to on at a `high` pin value, while the SainSmart relay modules do this on the `low` state.

To handle this, you can configure the module, to which value (high|low) to use for the ON state, which is always passed in the methods as a truthy value.

Default value is `'low'`

```js

// to use the official tessel relay module
// the pins 5 & 6 will be set 'low' on init, and pulled 'high' on activation
var relay = relaylib.use(tessel.port['A'], [5,6], 'high'); 

// hook a 4 channel relay on pin 1,2,3,4
// the pins 1,2,3,4 will be pulled 'high' on init, and set 'low' on activation
var relay = relaylib.use(tessel.port['A'], [1,2,3,4]); 

```


### Initialization

#### relaylib.use(tesselPort, channels, [callback])

returns a Relay instance

#### new relaylib.Relay(tesselPort, channels, [callback])

create a Relay instance directly


### Methods


#### relay.getState( relayChannel, [callback(err, state)] )

Gets the state of the specified relay channel: "true" for on and "false" for off.

#### relay.setState( relayChannel, state, [callback(err, state)])

Set the state of the relay on the given `channel`. The value of `state` is  evaluated as boolead,
any truthy value sets the relay switched on, otherwise off. 

Also check out the [`switchState`](#switchstate-string-highlow) option for initialization!

#### relay.toggle( relayChannel, [callback(err)] )

Switches the state of the specified relay channel: on if it's off; off if it's on.

#### relay.turnOff( relayChannel, [callback(err)] )
Switches off the specified relay channel.

#### relay.turnOn( relayChannel, [callback(err)] )
Switches on the specified relay channel.

### Events

#### relay.on( 'error', callback(err) )
Emitted upon error.

#### relay.on( 'latch', callback(channel, state))
Emitted when the latch state (boolean on or off ) is changed for a channel.

#### relay.on( 'ready', callback() )
Emitted upon first successful communication between the Tessel and the module.



## License

MIT License

Copyright (c) 2017 Szabolcs Szabolcsi-Toth

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


