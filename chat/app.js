var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');
const Joi= require("joi");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded  ({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
const schema=Joi.object({
    message: Joi.string().min(5).required(),
    author: Joi.string().required(),
    ts: Joi. required()
})


module.exports = app;

app.get("/chat/api/messages",(req,res)=>{

    fs.readFile('./api/messages.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        res.send(obj)
        }
    })
})

app.get("/chat/api/messages/:msg",(req,res)=>{
    const ts= parseInt(req.params.msg)

    fs.readFile('./api/messages.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        obj.forEach(element => {
            if (element["ts"]===ts){
                res.send(element)
            }

        });
        
        }
    })
})

app.post("/chat/api/messages",(req,res)=>{
    console.log(req.body.message)
    const{error}=schema.validate(req.body)
    if (error){
        return res.status(400).send(error)
    }
    fs.readFile('./api/messages.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        nuevo={"message":req.body.message, "author": req.body.author, "ts": req.body.ts }
        obj.push(nuevo);
        var json = JSON.stringify(obj);
        fs.writeFile('./api/messages.json', json, (err) => {
            if (err) {
                res.status(400).send("nel")
                throw err;
                
            }else{
                console.log('Data written to file');
                res.send(req.body)
            }
        });
        
    }});
})

app.put("/chat/api/messages/:ts",(req,res)=>{
    const ts= parseInt(req.params.ts)
    const{error}=schema.validate(req.body)
    if (error){
        return res.status(400).send(error)
    }

    fs.readFile('./api/messages.json', 'utf8', function readFileCallback(err, data){
        let bol=false
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        for (i = 0; i < obj.length; i++)  {
            console.log("puta")
            element=obj[i]
            if (element["ts"]===ts){
                
                element["message"]= req.body.message;
                element["author"]=req.body.author;
                obj[i]=element
                console.log(obj)
                var json = JSON.stringify(obj);
                fs.writeFile('./api/messages.json', json, (err) => {
                    if (err) {
                        
                        throw err;
                    }
                    bol=true
                    console.log('Data written to file');
                    res.send(req.body)
                });
            }


        };
        if (bol===false){
            res.status(404).send("No existe el ts")
        }

        }
    })
})





app.delete("/chat/api/messages/:ts",(req,res)=>{
    const ts= parseInt(req.params.ts)

    let bol=false
    fs.readFile('./api/messages.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data);
        for (i = 0; i < obj.length; i++)  {
            console.log("puta")
            element=obj[i]
            if (element["ts"]===ts){
                
               
                obj.splice(i, 1);
           
                var json = JSON.stringify(obj);
                fs.writeFile('./api/messages.json', json, (err) => {
                    if (err) throw err;
                    console.log('Data written to file');
                    bol=true
                    res.send(req.body)
                });
            }


        };
        if (bol===false){
            res.status(404).send("no existe el ts")
        }

        }
    })
})