const mongoose = require("mongoose")
var bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        max:30,
        min:3
    },
    password:{
        type:String,
        required:true,

    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    },
    role:{
        type:String,
        enum: ['user', 'admin'],
        default:'user'
    },
    pics:{
        type:[String],
    }

},
{ timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
