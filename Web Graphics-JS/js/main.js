var submit;
const file_reader = new FileReader();
const CanvasDataObj = {};

window.addEventListener("load",function(){

    submit = document.getElementById("submit");
    submit.addEventListener("click",initUI);

});

function typeMIME ( type ) {

    return type.includes('video') ? 1 : (type.includes('image') ? 0 : 1);

}

function initUI () {

    const inputFile = document.getElementById("file").files;
    const container = document.getElementById("media-container");
    //let mime = typeMIME(inputFile.type);
    let media = container.getElementsByClassName("media");
    //removed mime <==> mimeType
    setUI(media, inputFile, container);

}

//Remove mimeType check while working on carousel
function setUI ( mediaObjs, mediaFile, mediaContainer ) {

    const carouselCont = document.getElementById("col-carousel-container");
    const carouselInner = document.getElementById("video-frames");
    const defaultDisplay = document.getElementById("default");
    //if( mimeType === 0){
    
    function readAndAdd ( file ) {
    
      let reader = new FileReader();
    
      reader.addEventListener("load", function () {
          
        let img = document.createElement("img");
    
        if ( this.readyState == 2 ) {
            img.src = reader.result;
        }
            img.onload = function () {
                setCarousel( carouselInner, this);
            };
      }, false);
    
      reader.readAsDataURL(file);
    }
    
    if ( mediaFile ) {
    
    defaultDisplay.style.display = "none";
    [].forEach.call(mediaFile, readAndAdd);
    carouselCont.style.display = "block";

    }

} 
/*
        if ( mediaFile.length > 0 ) {

            /**
             * Fix: file_reader is still busy when trying to read next file
             * Uncaught DOMException: Failed to execute 'readAsDataURL' on 'FileReader': The object is already busy reading Blobs.
             * possible fix readyState change conditional return to exit callback
             *
            file_reader.addEventListener("loadend", function () {
                let img = document.createElement("img");

                if ( this.readyState == 2 ) {
                    img.src = file_reader.result;
                }
                    img.onload = function () {
                        setCarousel( carouselInner, this);
                        const defaultDisplay = document.getElementById("default");
                        defaultDisplay.style.display = "none";
                    };
            }, false);

            for ( let i=0; i < mediaFile.length; i++ ) {
                
                file_reader.readAsDataURL(mediaFile[i]);
            }
            carouselCont.style.display = "block";
        }

   }else if( mimeType === 1){

        file_reader.addEventListener("load", function () {
            mediaObjs[0].preload = "auto";
            mediaObjs[0].style.height = "100%";
            mediaObjs[0].style.width = "100%";
            mediaObjs[0].src = file_reader.result;
            mediaObjs[0].type = "video/mp4";
            mediaObjs[0].controls = true;
            mediaObjs[0].style.display = "block";
        }, false);

        if ( mediaFile ) {

            file_reader.readAsDataURL(mediaFile);
            mediaObjs[0].onloadedmetadata = function() {
                initVideoUI(mediaObjs[0]);
            };

        }

    }

}*/

function setCarousel ( inner, media ) {

    const carouselDiv = document.createElement("div");

    carouselDiv.className = "item";
    carouselDiv.appendChild(media);
    inner.appendChild(carouselDiv);

}
function initVideoUI ( video ) {

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

    video.addEventListener('loadeddata', function () {
        /**
         * event makes sure video is fully loaded
         * sets the playback time to 0
         **/
         this.currentTime = 0;
    }, false);

    Submit.addEventListener("click", function GetFrames () {
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

    video.addEventListener('seeked', function () {
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
            //let canvas = document.getElementsByClassName("frame-canvas");
            let canvas = document.getElementsByClassName("carousel-item");
            const desCanvas = document.getElementById("selected-frame");
    		for( let i=0; i<canvas.length; i++ ) {
    		    canvas[i].addEventListener("click", function(e){
                    drawImg(desCanvas, e.target);
                }, false);
    		}
        }
            
    }, false);

    function generateThumbnail ( frame ) {

                if(framesArea.innerHTML == "Video frames appear here") framesArea.innerHTML = '';
                    let c = document.createElement("canvas");
                    //c.className = "carousel-item frame-canvas";
                    c.className = "carousel-item";

                    let ctx = c.getContext("2d");
                    c.width = 220;
                    c.height = 190;
                    ctx.drawImage(frame, 0, 0, c.width, c.height);
                    framesArea.appendChild(c);

    }
}

function drawImg ( desMedia , srcMedia ) {

    if ( srcMedia.tagName === "IMG" ) {
        desMedia.width = srcMedia.width;
        desMedia.height = srcMedia.height;
        desMedia.style.display = "block";
        srcMedia.style.display = "none";
    }

    const ctx = desMedia.getContext('2d');
    ctx.drawImage(srcMedia, 0, 0, desMedia.width, desMedia.height);

    CanvasDataObj.ctxObj = ctx;
    CanvasDataObj.h = srcMedia.height;
    CanvasDataObj.w = srcMedia.width;
    CanvasDataObj.origImg = srcMedia;

    set_graphics_Btns();

}

function set_graphics_Btns () {

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