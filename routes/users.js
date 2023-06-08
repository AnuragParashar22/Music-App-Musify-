const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")
const dotenv = require("dotenv").config();


const db = process.env.database;
// mongoose.connect("mongodb://0.0.0.0:27017/musicapp").then(function(){
//   console.log("connected to db !!");
// })
mongoose.connect(db).then(function(){
  console.log("connected to db !!");
})

var userSchema = new mongoose.Schema({
  name:String,
  password:String,
  email:String,
  username:String,
  isCreater:{
    type:Boolean,
    default:false
  },
  phonenum:String,
  dpimg:String,
  dpimgid:String,
  playlist:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'playlist'
  }],
  otp:{
     type:String,
     default:""
  },
  favourites:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:'songs'
  }],
  dob:String,
  isAdmin:{
    type:Boolean,
    default:false
  }

})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);