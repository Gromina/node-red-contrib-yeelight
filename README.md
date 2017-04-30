# Node-RED-contrib-yeelight

## Yeelight smart bulb
[Yeelight](https://www.yeelight.com) is smart RGB led bulb with WIFI on board.

## making it controllable
Yeelight comes with mobile apps to control its status. 
Usually lamp stays online holding connection to Yeelight cloud servers
Any mobile apps which control lightbulb actually communicate to those cloud servers.

*If you want to integrate lamp into you own smart home solution you have to enable its ["developer mode"](https://www.yeelight.com/en_US/developer)*
In this mode lamp listens on UDP 55443 port and responses to commands

## Protocol reference
Developer mode communication protocol is described [here](http://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf)

## Node red usage

### Install
```
npm install node-red-contrib-yeelight
```

### Use

Find yeelight node

You must add config node for each lamp

Then just send messages to yeelight node

Command is configured right in a node
