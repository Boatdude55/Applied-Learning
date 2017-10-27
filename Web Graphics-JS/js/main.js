var submit, input_file;
const file_reader = new FileReader();
const CanvasDataObj = {};

window.addEventListener("load",function(){

    submit = document.getElementById("submit");
    submit.addEventListener("click",initUI);

});

function deepCopy ( src , des ) {
    console.log(des, src);
    if(des !== undefined){

        for ( let i = 0; i < src.length; i++) {

            des[i] = src[i];

        }

    }else{
        let des = new Uint8ClampedArray(src.length);
        for ( let i = 0; i < src.length; i++) {

            des[i] = src[i];

        }
        return des;
    }

}

function typeMIME ( type ) {

    return type.includes('video') ? 1 : (type.includes('image') ? 0 : 1);  
}
function initUI () {

    input_file = document.getElementById("file").files[0];

    let mime = typeMIME(input_file.type);
    let container = setDisplay(mime);
    let media = container.getElementsByClassName("media");
    setUI(media, mime, input_file, container);
}

function setUI ( mediaObjs, mimeType, mediaFile, uiContainer ) {
    
    if( mimeType === 0){
        const img = document.createElement("img");
        file_reader.addEventListener("load", function () {
            img.src = file_reader.result;
        }, false);
    
        if (mediaFile) {
            file_reader.readAsDataURL(mediaFile);
            img.onload = function() {
                drawImg(mediaObjs[0],this);
            };
        }
    }else if( mimeType === 1){
        
        file_reader.addEventListener("load", function () {
            mediaObjs[0].preload = "auto";
            mediaObjs[0].src = file_reader.result;
            mediaObjs[0].type = "video/mp4";
        }, false);

        if (mediaFile) {
            file_reader.readAsDataURL(mediaFile);
            mediaObjs[0].onloadedmetadata = function() {
                initVideoUI(mediaObjs[0], uiContainer);
            };
        }
    }
}

function initVideoUI ( video, ui ) {

    /**
     * Variables for InputContent event handling
    **/
    const Submit = document.getElementById("SubmitTimes");
    const StartTime = document.getElementById("startTime");
    const EndTime = document.getElementById("endTime");
    const SetTimes = [StartTime, EndTime];
    const times = [0,0];
    
    const framesArea = document.getElementById("video-frames");
    const fps = 1/4;//gives me 4 fps
    
    video.addEventListener('loadeddata', function() {
            /**
             * event makes sure video is fully loaded
             * sets the playback time to 0
             **/
             this.currentTime = 0;
            }, false);

    Submit.addEventListener("click", function GetFrames(){
                /**
                 * event used to trigger getting of video frames
                 **/
                 
                if(framesArea.childElementCount > 0){
                    /**
                     * reloading the video so there are no playback issues
                     * might remove later
                     * */
                    video.load();
                }
                
                /**
                 * Might turn this into a function later
                 * */
                let j=0;
                for(let i of SetTimes){
                    /**
                     * Converts the times into a format
                     * that video events can use 
                     * Take substrings using the colon as base
                     * parse substrings to ints
                     * multiply string1 by 60 and add on string2 for a time
                    **/
                    let x = parseInt(i.value.substr(0, i.value.length - 3), 10);
                    let y = parseInt(i.value.substr(i.value.length - 2), 10);
                    i = (x*60) + y;
                    times[j] = i;
                    j++;
                }
                
                video.currentTime = times[0];//setting a new currentTime triggers seeking
            });

    video.addEventListener('seeked', function() {
                    /**when frame is captured, increase with fps trying to get a decent framerate
                     * keep in mind this for rotoscoping so the framerate may not have to be that high
                     * */
                    times[0]+=(fps);
                   //if still in seeking range
                    if ( times[0] <= times[1] ) {

                        /**Event is triggered when seeking is done
                        * generateThumbnail() will get the currentTime and convert it to canvas element
                        * */
                        generateThumbnail(this);
                        //another seeked event triggered
                        video.currentTime = times[0];
                    }
                	else {
                        //getting a nodelist of the newly made canvas elements
                        let canvas = document.getElementsByClassName("frame-canvas");
                        const desCanvas = document.getElementById("selected-frame");
                		for(var i=0;i<canvas.length;i++){
                		    canvas[i].addEventListener("click", function(e){
                                drawImg(desCanvas, e.target);
                                
                            }, false);
                		}
                    }
            
                }, false);

    function generateThumbnail ( frame ) {
                if(framesArea.innerHTML == "Video frames appear here") framesArea.innerHTML = '';
                    //let a = document.createElement("a");
                    let c = document.createElement("canvas");
                    c.className = "frame-canvas";
                    //a.className = "frame-canvas";
                    //a.appendChild(c);
                    
                    let ctx = c.getContext("2d");
                    c.width = 160;
                    c.height = 90;
                    ctx.drawImage(frame, 0, 0, 160, 90);
                    framesArea.appendChild(c);

            }
}

function drawImg ( canvas , img ) {

    if(img.tagName === "IMG" ){
        canvas.width = img.width;
        canvas.height = img.height;
    }

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    img.style.display = 'none';

    CanvasDataObj.ctxObj = ctx;
    CanvasDataObj.h = img.height;
    CanvasDataObj.w = img.width;
    CanvasDataObj.origImg = img;

    set_graphics_Btns();

}

function set_graphics_Btns() {
    var grayscalebtn = document.getElementById('greyscalebtn');
    grayscalebtn.addEventListener('click', greyscale);
    var invertbtn = document.getElementById('invertbtn');
    invertbtn.addEventListener('click', invert);
    var resetbtn = document.getElementById("reset");
    resetbtn.addEventListener("click", resetImg);
}

var invert = function() {

    let invertedPxArray = CanvasDataObj.ctxObj.getImageData(0,0,CanvasDataObj.w, CanvasDataObj.h);
    for (let i = 0; i < invertedPxArray.data.length; i += 4) {
      invertedPxArray.data[i]     = 255 - invertedPxArray.data[i];     // red
      invertedPxArray.data[i + 1] = 255 - invertedPxArray.data[i + 1]; // green
      invertedPxArray.data[i + 2] = 255 - invertedPxArray.data[i + 2]; // blue
    }
    CanvasDataObj.ctxObj.putImageData(invertedPxArray, 0, 0);
    
};

var greyscale = function () {

    var Brightness = function(red, grn, blu)
    {
        return ((0.2126 * red) + (0.7152 * grn) + (0.0722 * blu) + 0.5) ;
    };

    let greyscalePxArray = CanvasDataObj.ctxObj.getImageData(0,0,CanvasDataObj.w, CanvasDataObj.h);
    
    for ( let i = 0; i < greyscalePxArray.data.length; i += 4 ) {
        
      var avg = Brightness(
          greyscalePxArray.data[i], greyscalePxArray.data[i + 1], greyscalePxArray.data[i + 2]
          );
          
      greyscalePxArray.data[i]     = avg; // red
      greyscalePxArray.data[i + 1] = avg; // green
      greyscalePxArray.data[i + 2] = avg; // blue
      
    }

    CanvasDataObj.ctxObj.putImageData(greyscalePxArray, 0, 0);
    
};

var resetImg = function () {
    CanvasDataObj.ctxObj.drawImage(CanvasDataObj.origImg, 0, 0);
};

function setDisplay ( mimeType ) {
    
    if( mimeType === 0){
        const imgContainer = document.getElementById("imageFileContainer");
        imgContainer.style.display = "block";
        return imgContainer;
    }else if( mimeType === 1){
        const vidContainer = document.getElementById("videoFileContainer");
        vidContainer.style.display = "block";
        setCSS(vidContainer);
        return vidContainer;
    }    
    
}

function setCSS ( ui ) {
    ui.style.width = "100%";
    ui.style.height = "95%";
}