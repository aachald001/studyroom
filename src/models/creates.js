const mongoose=require("mongoose");
const groupSchema= new mongoose.Schema({
    grpname:{
        type:String,
        required:true
    },
    grpid:{
        type:String,
        required:true,
        unique:true 
    },
    subject:{
        type:String,
        required:true
    },
    startdate:{
        type:Date,
        required:true  
    },
    enddate:{
     type:Date,
     required:true
    },
    groupleadername:{
        type:String,
        required:true
    },
    groupleaderid:{
       type:String,
       required:true
    },
    participent:{
        type:[String],
        required:false
    }

})

const Create= new mongoose.model("Groupinfo",groupSchema);
module.exports = Create;   