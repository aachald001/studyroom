const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    phone:{
        type:Number,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:true  
    },
    confirmpassword: {
     type:String,
     required:true
    },
    // ledeargrp:{
    //     type:[String],
    //     required:false 
    // },
    participentgrp:{
        type:[String],
        required:false 
    }

})

userSchema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = undefined;
    }
    next();
})
const Register = new mongoose.model("Userinfo",userSchema);
module.exports = Register;   