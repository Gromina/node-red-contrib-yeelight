module.exports = function(RED) {
    "use strict";
    var Yeelight = require("yeelight2")

    function YeelightConnection(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        if(this.credentials &&
            this.credentials.hostname && this.credentials.portnum){


            setTimeout(
             (function(self) {
                 return function() {
                        self.setupConnection.apply(self, arguments);
                    }
             })(this), 1000
            );
        }

        this.on('close', function() {
            this.light.exit();
        });

        this.connected = function(){
            console.log("connected to lamp")
            node.status({fill:"green",shape:"ring",text:"Connected"});
        }
        this.setupConnection = function(){
            this.light = Yeelight(node.credentials.hostname,node.credentials.portnum);
            if(this.light){
                node.light = this.light;
            }
            this.light.on('error',function(err){
                console.log("Yeelight error",err)
                node.status({fill:"red",shape:"ring",text:err});
                node.light = null;
                node.error(err);
                // try to reconnect in 10 seconds
                setTimeout(
                 (function(self) {
                     return function() {
                            node.setupConnection.apply(self, arguments);
                        }
                 })(this), 1000*2
                );
            })
        }

    }

    RED.nodes.registerType("yeelight-config",YeelightConnection,{
        credentials: {
            hostname: { type:"text" },
            portnum: { type:"text" }
        }
    });



    function YeelightNode(n) {
        RED.nodes.createNode(this,n);
        this.config = RED.nodes.getNode(n.config);
        this.command = n.command

        var node = this;

        node.status({});

        var msg = {};
        this.send(msg);
        
        this.on('input', function (msg) {
            try {
                var cmd = this.command
                this.light = this.config ? this.config.light : null;
                var send
                if (Array.isArray(msg.payload)) {
                    send = this.light[cmd](...msg.payload)
                } else {
                    send = this.light[cmd](msg.payload)
                }
                send.then(function(response) {
                    msg.payload = response;
                    node.send(msg);
                });
                node.status({fill:"green",shape:"ring",text:"Connected"});
            } catch(err) {
                node.status({fill:"red",shape:"ring",text:err});
                node.error(err)
            }
        });
        this.on("close", function() {

        });
    }

    RED.nodes.registerType("yeelight",YeelightNode);

}
