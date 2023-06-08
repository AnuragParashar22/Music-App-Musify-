var mongoose = require("mongoose");

var PlaySchema = mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    playlistname:String,
    time:String,
    songs:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"songs"
    }]
})

module.exports= mongoose.model("playlist", PlaySchema);