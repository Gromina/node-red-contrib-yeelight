module.exports = function(RED) {
    "use strict";
    var Yeelight = require("yeelight2")

    function YeelightConnection(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        if(this.credentials &&
            this.credentials.hostname && this.credentials.portnum){


            window.setTimeout(
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

        this.setupConnection = function(){
            try {
                this.light = Yeelight("yeelight://"+this.credentials.hostname+":"+this.credentials.portnum);
            } catch(err) {
                node.status({fill:"red",shape:"ring",text:err});
                this.light = null;
                this.error(err);

                // try to reconnect in 5 minutes
                window.setTimeout(
                 (function(self) {
                     return function() {
                            self.setupConnection.apply(self, arguments);
                        }
                 })(this), 1000*60*5
                );
            }
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
				this.light[cmd](msg.payload)
			} catch(err) {
				node.status({fill:"red",shape:"ring",text:err});
				this.error(err)
			}
        });

        this.on("close", function() {

        });
    }

    RED.nodes.registerType("yeelight",YeelightNode);

}
