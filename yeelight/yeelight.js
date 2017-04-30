module.exports = function(RED) {
    "use strict";
    var Yeelight = require("yeelight2")

    function YeelightConnection(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        if(this.credentials &&
            this.credentials.hostname && this.credentials.portnum){

            this.light = Yeelight("yeelight://"+this.credentials.hostname+":"+this.credentials.portnum);
        }
        this.on('close', function() {
            this.light.exit();
        });

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
        this.light = this.config ? this.config.light : null;

        var node = this;

        if (!this.light) {
            node.warn("Missing Yeelight config");
            node.status({fill:"red",shape:"ring",text:"Missing Yeelight Config"});
            return;
        }
        node.status({});

        var msg = {};
        this.send(msg);

        this.on('input', function (msg) {
            var cmd = this.command
            this.light[cmd](msg.payload)
            //ithis.light.toggle()
        });

        this.on("close", function() {

        });
    }

    RED.nodes.registerType("yeelight",YeelightNode);

}
