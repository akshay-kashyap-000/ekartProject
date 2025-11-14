//! username, email, password , role, contactNumber, 

import { required } from "joi";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
        default:"user"
    },
    contactNumber:{
        type:String,
        required:true,
        unique:true
    },
    isVerified:{
        type:Boolean,
        required:r=true,
        default:false
    }
},
    {timestamps:true, toJSON:"", toObject:""}

)