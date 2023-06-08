var express = require('express');
var router = express.Router();
var passport = require("passport")
var userModel = require("./users");
var songModel = require("./songs")
var playModel = require("./playlist")
const localStrategy = require('passport-local')
passport.use(new localStrategy(userModel.authenticate()))
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const songs = require('./songs');
var mailer = require("../nodemailer");
const crypto = require('crypto');
const path = require("path");
const { log } = require('console');
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
const dotenv = require("dotenv").config();


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });
cloudname = process.env.cloud_name;
key = process.env.api_key;
secret = process.env.api_secret;
cloudinary.config({
  cloud_name: `${cloudname}`,
  api_key: `${key}`,
  api_secret: `${secret}`,
});

cloudinary.config({
  cloud_name: "dva2mw96s",
  api_key: "597763852578164",
  api_secret: "cKjVOS77VQJ1453njCNxL0VV2lc",
});

async function AudiouploadToCloudinary(audiopath) {
  return cloudinary.uploader.upload(audiopath,{folder:"musicapp", resource_type: "raw" }).then((result) => { fs.unlinkSync(audiopath);
          return {
            result:result,
            id:result.public_id,
            url: result.url,
          };
      }).catch((error) => {
          fs.unlinkSync(audiopath);
          return { message: "Fail" };
      });
}

async function ImguploadToCloudinary(imgpath) {
  // var mainFolderName = "main";
// var filePathOnCloudinary = mainFolderName + "/" + imgpath; 
return cloudinary.uploader.upload(imgpath,{folder:"musicapp"}).then((result) => { fs.unlinkSync(imgpath);
          return {
            result:result,
            id:result.public_id,
            url: result.url,
          };
      }).catch((error) => {
          fs.unlinkSync(imgpath);
          return { message: "Fail" };
      });
}



// Routes Starts from here !!


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/main',isloggedIn ,function(req, res, next) {

  var mysort = { likes: -1 };
  userModel.findOne({username:req.session.passport.user}).populate('playlist').then(function(data){
    songModel.find().sort(mysort).then(function(song){
      // console.log(song);
    res.render('main',{user:data,song:song})
  })
  })
});
router.post("/register",function(req,res){
var user = new userModel({
  name:req.body.name,
  username:req.body.username,
  email:req.body.email,
  phonenum:req.body.phonenum,
})
var old = userModel.findOne({username:req.body.username});
if(old){
res.redirect("/")
}
else{
  userModel.register(user,req.body.password).then(function(user){
    passport.authenticate('local')(req,res,function(){
      res.redirect("/main")
    })
  })
}
})

router.post('/login',passport.authenticate('local',{
  successRedirect:"/main",
  failureRedirect:"/"
}),function(req,res){
})
router.get('/logout',function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})



//Secondary Routes !!

// router.get("/allsongs",isloggedIn,function(req,res){
//   userModel.findOne({username:req.session.passport.user}).populate('playlist').then(function(user){
//   songModel.find().populate('userid').then(function(music){
//      res.render("Allsongs",{user:user,data:music})
//   })
// })
// })
router.get("/allsongs",isloggedIn, async function(req,res){
  var tot = await songModel.find()
//  console.log(tot.length)
  var temp = tot.length/5;
  // console.log(temp);
  temp = Math.ceil(Number(temp))
  // console.log(temp);
if(req.query.page<temp){
  var skip = req.query.page || 0;
}else{
  skip=0;
}
var user = await  userModel.findOne({username:req.session.passport.user}).populate('playlist')
var music = await songModel.find().populate('userid').limit(6).skip(skip*6);

 var prev = Number(skip);
 if(prev !== 0){
  prev = prev-1;
 }
 console.log(prev)
 var next = Number(skip)+1;
 console.log(next)
   res.render("Allsongs",{user:user,data:music,skip:next,prev:prev})
    

    })











router.get("/myprofile",isloggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user}).then(function(data){
    songModel.find().then(function(song){
      res.render("profile",{data:data,song:song})
    })
   
  })
})
router.post('/editprofile',upload.single('file'),isloggedIn,async function(req,res){
  console.log(req.file);
  if(req.file){
    var imgPath = req.file.path;
    var result = await ImguploadToCloudinary(imgPath);
var dts = await userModel.findOneAndUpdate({username:req.session.passport.user}, {
  name:req.body.name,
  phonenum:req.body.phonenum,
  dob:req.body.dob,
  email:req.body.email,
  dpimg:result.url,
  dpimgid:result.public_id
})
  }else{
    var dts = await userModel.findOneAndUpdate({username:req.session.passport.user}, {
      name:req.body.name,
      phonenum:req.body.phonenum,
      email:req.body.email,
      dob:req.body.dob,
      })
  }
  
  res.redirect("/myprofile")
})
router.get('/editprofile',isloggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user}).then(function(user){
    res.render("editprofile",{user:user})
  })
  
})




//song uploading and deleting and fav edit and play
router.get("/uploadsong",isloggedIn,async function(req,res){
  var user = await userModel.findOne({username:req.session.passport.user});
  if(user.isAdmin){
  res.render("uploadsong");
}
else{
  res.redirect("/main")
}
})
router.post("/songupload",isloggedIn,upload.fields([{name: 'audio', maxCount: 1}, { name: 'image', maxCount: 1 }]),async function(req,res){
    var user = await userModel.findOne({username:req.session.passport.user});
    if(user.isAdmin){
      var audiopath = req.files.audio[0].path;
      var imgPath = req.files.image[0].path;
      var result1 = await AudiouploadToCloudinary(audiopath);
     
      var result2 = await ImguploadToCloudinary(imgPath);
      
      var product = await songModel.create({
        userid:user._id,
        songname:req.body.songname,
        Artistname:req.body.artistname,
        Releasedate:req.body.date,
        type:req.body.type,
        img:result2.url,
        imgid:result2.id,
        Audioid:result1.id,
        Audio:result1.url
        })  
       res.redirect("/myprofile");
  }
    else{
      res.redirect("/main")
    }
      })   
      router.get("/editsongs",isloggedIn, async function(req,res){
        var tot = await songModel.find()
       console.log(tot.length)
        var temp = tot.length/4;
        console.log(temp);
        temp = Math.ceil(Number(temp))
        console.log(temp);
      if(req.query.page<temp){
        var skip = req.query.page || 0;
      }else{
        skip=0;
      }
      var user = await  userModel.findOne({username:req.session.passport.user}).populate('playlist')
      if(user.isAdmin){
       var music = await songModel.find().populate('userid').limit(5).skip(skip*5);
      
       var prev = Number(skip);
       if(prev !== 0){
        prev = prev-1;
       }
       console.log(prev)
       var next = Number(skip)+1;
       console.log(next)
         res.render("editsongpage",{user:user,data:music,skip:next,prev:prev})
          }
          else{
            res.redirect("/main")
           }
      
          })
      router.get("/edit/:id",isloggedIn,function(req,res){
        userModel.findOne({username:req.session.passport.user}).populate('playlist').then(function(user){
          if(user.isAdmin){
            songModel.findOne({_id:req.params.id}).populate('userid').then(function(music){
              res.render("editpage",{user:user,data:music})
           })
          }
         else{
          res.redirect("/main")
         }
      })
      })
      router.post("/songedit/:id",isloggedIn,function(req,res){
        userModel.findOne({username:req.session.passport.user}).populate('playlist').then(function(user){
          if(user.isAdmin){
            songModel.findOneAndUpdate({_id:req.params.id},{
              songname:req.body.songname,
              Artistname:req.body.artistname,
              Releasedate:req.body.date,
              type:req.body.type,
            }).then(function(){
              res.redirect("/editsongs")
            })
          }
            else{
              res.redirect("/main")
             }
        })
      })
      router.post("/songimgedit/:id",isloggedIn,upload.single("file"), async function(req,res){
        var user = await userModel.findOne({username:req.session.passport.user});
          if(user.isAdmin){
             var imgPath = req.file.path;
             var result2 = await ImguploadToCloudinary(imgPath);
             var song = await songModel.findOneAndUpdate({_id:req.params.id},{
              img:result2.url,
              imgid:result2.id
              })  
             res.redirect("/editsongs");
          }
          else{
            res.redirect("/main")
           }
      })
      router.get("/deletesong/:id",isloggedIn,async function(req,res){
     var user = await userModel.findOne({username:req.session.passport.user})
          if(user.isAdmin){
       var song = await songModel.findOneAndDelete({_id:req.params.id})
        let dlt1 = await cloudinary.uploader.destroy(song.Audioid, { resource_type: "raw" })
          let dlt2 = await cloudinary.uploader.destroy(song.imgid)
        res.redirect("back");}
      })



router.get("/playsong/:id",isloggedIn,async function(req,res){
 var user = await userModel.findOne({username:req.session.passport.user}).populate('playlist')
 var music = await songModel.findOne({_id:req.params.id})
  var value =  user.favourites.indexOf(music._id)
      // console.log(music);
      res.render("musicpage",{user:user,music:music,value:value})
    })

router.get("/nextsong",isloggedIn,function(req,res){
  songModel.aggregate([ { $sample: { size: 1 } } ]).then(function(data){

    // console.log(data[0]._id)
    // res.send(data[0])
    res.redirect(`/playsong/${data[0]._id}`)
  })
})



router.get("/favourites",isloggedIn,function(req,res){
userModel.findOne({username:req.session.passport.user}).populate('favourites').populate('playlist').then(function(data){
 res.render('favpage',{data:data})
})
})

router.get("/fav/:id",isloggedIn,function(req,res){
  songModel.findOne({_id:req.params.id}).then(function(music){
    userModel.findOne({username:req.session.passport.user}).then(function(data){
 if(data.favourites.indexOf(req.params.id) !== -1){
  data.favourites.splice(data.favourites.indexOf(music._id),1);
  data.save();
  res.send(data);
   // res.redirect("back")
 }else{
  data.favourites.push(music._id);
  data.save();
  res.send(data);
   // res.redirect("back")
 }
 })
})
})

router.get("/remove/:id",isloggedIn,function(req,res){
  songModel.findOne({_id:req.params.id}).then(function(music){
    userModel.findOne({username:req.session.passport.user}).then(function(data){
      data.favourites.splice(data.favourites.indexOf(music._id),1);
      data.save();
      
      res.redirect('/favourites')
    })
  })
})
// router.get("/fav/:id",isloggedIn,function(req,res){
// songModel.findOne({_id:req.params.id}).then(function(music){
//   userModel.findOne({username:req.session.passport.user}).then(function(data){
//     data.favourites.push(music._id);
//     data.save();
//     res.send(data);
//     // res.redirect('/favourites')
//   })
// })
// })
router.get('/delete/:id',isloggedIn,function(req,res){
songModel.findOneAndDelete({_id:req.params.id}).then(function(song){
  
})
})
router.get("/category/:type",isloggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user}).populate('playlist').then(function(user){
    songModel.find({type:req.params.type}).then(function(music){
      res.render("categorypage",{data:music,user:user,type:req.params.type})
    })
  })

})

router.get("/like/:id",isloggedIn,function(req,res){
songModel.findOne({_id:req.params.id}).then(function(music){
   console.log(music.likes.indexOf(req.session.passport.user));
  console.log(Boolean(music.likes.indexOf(req.session.passport.user)));
  
if(music.likes.indexOf(req.session.passport.user) !== -1){
  music.likes.splice(music.likes.indexOf(req.session.passport.user),1);
  music.save();
  res.send(music)
  // res.redirect("back")
}else{
  music.likes.push(req.session.passport.user);
  music.save();
  res.send(music)
  // res.redirect("back")
}
})
})


//Playlist Handling.


router.get("/myplaylist",isloggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user}).populate('playlist').then(function(data){
    res.render("myplaylist",{data:data})
  })
})
// router.post("/createplaylist",upload.single('playimg'),isloggedIn,async function(req,res){
//   var imgPath = req.file.path;
//   var user = await userModel.findOne({username:req.session.passport.user});
//   var result = await ImguploadToCloudinary(imgPath);
//   var playlist = await playModel.create({
//     userid:user._id,
//     playlistname:req.body.name ,
//     playimg:result.url,
//     // playimgid:result.publicid,
//   })
//   user.playlist.push(playlist._id);
//   res.redirect("/myplaylist")
// })
router.get("/createplaylist",isloggedIn, function(req,res){
   userModel.findOne({username:req.session.passport.user}).then(function(user){
        playModel.create({
          userid:user._id,
          playlistname:`#myplaylist_${user.playlist.length+1}`
        }).then(function(play){
          user.playlist.push(play._id)
          user.save();
          res.redirect('/myplaylist')
        })
   })
})
router.get("/openplaylist/:id",isloggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user}).populate('playlist').then(function(data){
    playModel.findOne({_id:req.params.id}).populate('songs').then(function(play){
      res.render("openplaylist",{data:data,play:play})
    })
  })

})
router.get("/addplay/:pid/:mid",isloggedIn, async function(req,res){
  // console.log(req.params.mid);
  // console.log(req.params.pid);
   let user = await userModel.findOne({username:req.session.passport.user});
   let play = await playModel.findOne({_id:req.params.pid});
  //  console.log(play);

   if(play.songs.indexOf(req.params.mid) !== -1){
    res.redirect("back")
  }else{
    play.songs.push(req.params.mid);
    play.save();
    res.redirect(`/openplaylist/${req.params.pid}`)
 
  }
})
router.get("/rmvsongplay/:pid/:mid",isloggedIn,async function(req,res){
  let play = await playModel.findOne({_id:req.params.pid});
  //  console.log(play);

   if(play.songs.indexOf(req.params.mid) !== -1){
    play.songs.splice(play.songs.indexOf(req.params.mid),1);
    play.save();
    res.redirect(`/openplaylist/${req.params.pid}`)
 
    }else{
    res.redirect("back")
  
  }
})
router.post("/editplay/:id",isloggedIn,function(req,res){
  playModel.findOneAndUpdate({_id:req.params.id},{playlistname:req.body.name}).then(function(){
    res.redirect(`/openplaylist/${req.params.id}`)
  })
})
router.get("/deleteplay/:id",isloggedIn,function(req,res){
  userModel.findOne({username:req.session.passport.user}).then(function(data){
    playModel.findOneAndDelete({_id:req.params.id}).then(function(){
      data.playlist.splice(data.playlist.indexOf(req.params.id),1);
      data.save();
    res.redirect(`/myplaylist`)
  })
})
})



//Playlist Handling ends.





router.post('/forgetpassword', function(req, res, next) {
  userModel.findOne({email:req.body.email}).then(function(dets){ 

    if(dets){
      require('crypto').randomBytes(10, function(err, buffer) {
        var token = buffer.toString('hex');
       dets.otp = token;
       dets.save();
       mailer(req.body.email, token ,dets._id);
       res.send("Kindly check Your mail for password recovery")
    });
    }
   else{
    res.send("No such user exists , please enter the correct information")
   }
  })
});
router.get('/forgot/password/:userid/otp/:otp', function(req,res){
  console.log(req.params.otp);
 userModel.findOne({_id:req.params.userid}).then(function(user){
  if(user.otp === req.params.otp){ 
    res.render('changepassword',{user:user})
 }
 else{
    res.send("glt url hai !!")
 }
 })

})
router.post('/reset/password/:id/:otp',function(req,res){
userModel.findOne({_id:req.params.id}).then(function(user){
 user.setPassword(req.body.password, function(){
  user.otp = "";
  user.save();
  res.redirect("/")
});
})

})








function isloggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  else(
    res.redirect('/')
  )
  }
  
module.exports = router;
