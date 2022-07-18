const express = require('express')
const app = express();
const mongoose = require('mongoose')
const SidSchema = require('./SidModel')
mongoose.connect('mongodb://localhost/gridDB')
const db = mongoose.connection

db.on('connected',()=>{
    console.log("connected succesfully")
})

db.on('error',(error)=>{
    console.log(error)
})

app.use(express.json())



app.get('/', (req, res) => {
    res.status(200).send('<h1>hello</h1>')
})

app.post('/api/sid/find',(req,res)=>{
    console.log(req)
    const sid = req.body.sid;
    console.log(sid)
    SidSchema.find({sid:sid}).then(item=>{
        console.log(item)
        res.send(item)
    }).catch(err=>console.log(err))
})

app.post('/api/sid',(req,res)=>{
    const sid = req.body.sid
    const hash = req.body.hash
    const newProduct = SidSchema({sid:sid,hash:hash})
    newProduct.save().then(prod=>{
       res.send(prod)
    }).catch(err=>console.log(err))
}
)

function TestMessage() {

    var sid = "ACa7d20bab7636a34da3df459c68ef8cb8"
    var auth_token = "4a35bd8742a465b3274f79d779fd7f17"
    var twilio = require("twilio")(sid, auth_token);
    twilio.messages.create({
        body: "hello this is a test message",
        from: "+12077427225",
        to: "+91 96674 98580"
    }).then(messages => {
        console.log("message has been sent")
        console.log(messages)
    }).catch(error => {
        console.log(error)
    })
}

// TestMessage()
// app.use(express.static('public'))


const port = 5000 || process.env.port
app.listen(port, () => {
    console.log(`started at ${port}`)
})