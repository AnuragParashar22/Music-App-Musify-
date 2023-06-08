// var song = document.getElementById("music");
// var progress = document.getElementById("progress")
// var icn = document.getElementById("icn")
// var endtime = document.getElementById("endtime")
// var begtime = document.getElementById("begtime")
// song.onloadedmetadata = function(){
//     progress.max = song.duration;
//     progress.value = song.currentTime;
    
//     endtime.innerHTML = `${Math.floor(song.duration/60)}:${Math.floor(song.duration%60)}`;

//     begtime.innerHTML = `${Math.floor(song.currentTime/60)}:${Math.floor(song.currentTime%60)}`;
// }
// function formattime(time){
//     var min = Math.floor(time / 60);
//     if(min < 10){
//         min = `0${min}`
//     }
//     var sec = Math.floor(time % 60);
//     if(min<10){
//         min = `0${sec}`
//     }
//     return `${min}:${sec}`
// }
// if(song.play()){
//      setInterval(()=>{
//       progress.value = song.currentTime;
//       begtime.innerHTML = `${Math.floor(song.currentTime/60)}:${Math.floor(song.currentTime%60)}`;
   
//      },500)
// }
// progress.onchange = function(){
//     song.play();
//     song.currentTime =  progress.value;
//     icn.classList.add("ri-pause-fill");
// icn.classList.remove("ri-play-fill");
//     begtime.innerHTML = `${Math.floor(song.currentTime/60)}:${Math.floor(song.currentTime%60)}`;
//     // begtime.innerHTML =   song.currentTime%60;

// }
// function playpause(){
// if(icn.classList.contains("ri-pause-fill")){
// song.pause();
// icn.classList.remove("ri-pause-fill");
// icn.classList.add("ri-play-fill");
// }
// else{
//  song.play();
// icn.classList.add("ri-pause-fill");
// icn.classList.remove("ri-play-fill");
// }
// }
   
 // document.querySelector("#addp").addEventListener("mouseover",function(){
        //     document.querySelector("#playopt").style.display= "initial"
        // })
        // document.querySelector("#playopt").addEventListener("mouseover",function(){
        //     document.querySelector("#playopt").style.display= "initial"
        // })
        // document.querySelector("#addp").addEventListener("mouseleave",function(){
        //     document.querySelector("#playopt").style.display= "none"
        // })
        

        var flag = 0;
        
        document.querySelector('.ri-menu-line').addEventListener("click",function(req,res){

            if(flag === 0){

        document.querySelector("#left").style.left="0%"
        flag = 1;
            }else if(flag === 1){
                document.querySelector("#left").style.left="-100%"
       
    
    flag=0;  
            }
    })
              var fla = 0;
        
        document.querySelector('#addp').addEventListener("click",function(req,res){

            if(fla === 0){
                document.querySelector("#playopt").style.display = "initial";
                  fla = 1;
            }else if(fla === 1){
                document.querySelector("#playopt").style.display = "none"
               
    fla=0;  
            }
    })
      
        
           var song = document.getElementById("music");
var progress = document.getElementById("progress")
var icn = document.getElementById("icn")
var endtime = document.getElementById("endtime")
var begtime = document.getElementById("begtime")
song.onloadedmetadata = function(){
    progress.max = song.duration;
    progress.value = song.currentTime;
    
    endtime.innerHTML = `${Math.floor(song.duration/60)}:${Math.floor(song.duration%60)}`;

    begtime.innerHTML = `${Math.floor(song.currentTime/60)}:${Math.floor(song.currentTime%60)}`;
}
function formattime(time){
    var min = Math.floor(time / 60);
    if(min < 10){
        min = `0${min}`
    }
    var sec = Math.floor(time % 60);
    if(min<10){
        min = `0${sec}`
    }
    return `${min}:${sec}`
}
if(song.play()){
     setInterval(()=>{
      progress.value = song.currentTime;
      begtime.innerHTML = `${Math.floor(song.currentTime/60)}:${Math.floor(song.currentTime%60)}`;
   
     },500)
}
progress.onchange = function(){
    song.play();
    song.currentTime =  progress.value;
    icn.classList.add("ri-pause-fill");
icn.classList.remove("ri-play-fill");
    begtime.innerHTML = `${Math.floor(song.currentTime/60)}:${Math.floor(song.currentTime%60)}`;
    // begtime.innerHTML =   song.currentTime%60;

}
function playpause(){
if(icn.classList.contains("ri-pause-fill")){
song.pause();
icn.classList.remove("ri-pause-fill");
icn.classList.add("ri-play-fill");
}
else{
 song.play();
icn.classList.add("ri-pause-fill");
icn.classList.remove("ri-play-fill");
}
}
   

        
     

