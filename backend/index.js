const express = require('express')
const app = express();
const mongoose = require('mongoose')
const SidSchema = require('./SidModel')
const prodNameToHash = require('./ProductModel')
const userAddress = require('./UserAddressModel')
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
    const sid = req.body.sid;
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

app.put('/api/saveID',(req,res)=>{
    const tokenID = req.body.tokenID
    const sid = req.body.sid
    SidSchema.findOneAndUpdate({sid:sid},{tokenID:tokenID}).then(item=>{
        res.send(item)
    }).catch(err=>console.log(err))
})

app.post('/api/saveAddr',async(req,res)=>{
    const addres= req.body.address;
    const coin= req.body.coins;
    var check = null;
    check = await  userAddress.exists({address:addres})
    if(check==null){
        const newAddr = userAddress({ address: addres})
        newAddr.save().then(prod => {
            res.send(prod)
        }).catch(err => console.log(err))
    }
  
}
)

app.post("/api/prodName",(req,res)=>{
    const prodName = req.body.productName
    const hash = req.body.hash
    const newItem = prodNameToHash({ prodName: prodName, hash: hash })
    newItem.save().then(prod => {
        res.send(prod)
    }).catch(err => console.log(err))
})

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