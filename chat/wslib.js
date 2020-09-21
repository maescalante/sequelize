const WebSocket = require("ws");
const Joi= require("joi");
const fs = require("fs");
const clients = [];
const messages = [];
const names=["Bob Martinez", "Sara Elizondo"]

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.id=names[0]
    names.shift()
    console.log(names)
    clients.push(ws);
     
    sendMessages();
   
    ws.on("message", (message) => {
      messages.push(message);
      
      fs.readFile('./api/messages.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        nuevo={"message":message, "author": ws.id, "ts": Date.now() }
       
        obj.push(nuevo);
        var json = JSON.stringify(obj);
        fs.writeFile('./api/messages.json', json, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
    }});
      sendMessages();
    });
  });

  const sendMessages = () => {
    clients.forEach((client) => client.send(JSON.stringify(messages)));
  };
};



exports.wsConnection = wsConnection;