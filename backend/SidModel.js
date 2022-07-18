const mongoose = require('mongoose')

const SidSchema = mongoose.Schema({
    sid : {
        type : String,
        required: true,
        unique:true,
    },
    hash :{
        type : String,
        required : true,
    }
})

module.exports = mongoose.model("SidSchema",SidSchema)