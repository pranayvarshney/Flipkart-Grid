const mongoose = require('mongoose')

const prodNameToHash = mongoose.Schema({
    productName: {
        type: String,
        required: true,
        unique: true,
    },
    hash: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("prodNameToHash", prodNameToHash)