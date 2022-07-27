const mongoose = require('mongoose')

const userAddress = mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    }
   
    
})

module.exports = mongoose.model("userAddress", userAddress)