var mongoose = require("mongoose");

var songSchema = mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    songname:String,
    Artistname:String,
    Releasedate:String,
    likes:{
        type:[],
        default:null
    },
    img:{
        type:String,
        default:""
    },
    imgid:{
         type:String,
         default:''
    },
    Audio:String,
    Audioid:{
        type:String,
        default:''
   },
    type:String
})

module.exports= mongoose.model("songs", songSchema);