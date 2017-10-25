var submit;
var img = document.createElement("img");
var input_file, file_name, file_type;
var file_reader = new FileReader();

var canvas, ctx, imageData;
var data = [];
window.addEventListener("load",function(){
    submit = document.getElementById("submit");
    submit.addEventListener("click",setImg);
});

function setImg() {
    input_file = document.getElementById("file").files[0];
    
    file_reader.addEventListener("load", function () {
        img.src = file_reader.result;
    }, false);
    
    if (input_file) {
        file_reader.readAsDataURL(input_file);
        img.onload = function() {
            drawImg(this);
        };
    }
}

function drawImg(img) {
    canvas = document.getElementById('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    //console.log(canvas.width, canvas.height);
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    img.style.display = 'none';
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //console.log(imageData.width, imageData.height);
    data = imageData.data;
    set_graphics_Btns();
    
}

function set_graphics_Btns() {
    var grayscalebtn = document.getElementById('grayscalebtn');
    grayscalebtn.addEventListener('click', grayscale);
    var smoothbtn = document.getElementById('smoothbtn');
    smoothbtn.addEventListener('click', smooth);
    var edgebtn = document.getElementById('edgebtn');
    edgebtn.addEventListener('click', sobel_detection);
    var invertbtn = document.getElementById('invertbtn');
    invertbtn.addEventListener('click', invert);
    var resetbtn = document.getElementById("reset");
    resetbtn.addEventListener("click", resetImg);
}
/*
var SetUp_Gaussian_Kernel = function(){
    this.kernel_radius = 2,
    this.kernel = new Array(this.kernel_radius),
    
    this.Gaussian_Equation_Num = function(delta_x){
            var num = Math.pow(delta_x,2);
            num *= -1;
            var denom = 2;
            var x = num/denom;
            x = Math.exp(x);
            return x;
    },
    
    this.Gaussian_Equation_Denom = function(){
        var x = Math.PI * 2;
        x = Math.sqrt(x);
        return x;
    };
    
    this.Gaussian_Equation = function(){
        var weight = 0; var kernel=[0];
        for(var i=0; i<this.kernel_radius; i++){
            weight = (this.Gaussian_Equation_Num(i))/(this.Gaussian_Equation_Denom());
            kernel[i] = weight;
            console.log(weight);
        }
        return this.kernel;
    };
    
    this.Scaled_Gaussian_Kernel = function(){
        var scaled_kernel = this.Gaussian_Equation();
        var scaled = 0;
        var max_old = scaled_kernel[0]; var min_old = scaled_kernel[4];
        var max_new = 1; var min_new = 0;
        var old_range = max_old - min_old;
        var new_range = max_new - min_new;
        for(var n=0; n<this.kernel_radius; n++){
            scaled = ((scaled_kernel[n] - min_old)/old_range) * (new_range + min_new);
            //alert(scaled);
            scaled_kernel[n] = scaled;
            console.log(scaled);
        }
        return scaled_kernel;
    };
};*///Gaussian Equation to create weighted kernel is buggy
/**
 * Only X axis filter works 
 * */
var Gaussian_Filter = function(original_pxData, canvas_tool ,canvas_obj, original_img, kernel){
    this.original_data = original_pxData;
    this.canvas = canvas_obj;
    this.canvas_tool = canvas_tool;
    this.img_width = original_img.naturalWidth;
    this.img_height = original_img.naturalHeight;
    this.kernel = kernel;
    this.DeepCopy_PxData = function(original){
        var new_data_arry = [0];
        new_data_arry.length = original.length;
        for(var i=0; i<original.length; i++){
            new_data_arry[i] = original[i];
        }
        return new_data_arry;
    };
    this.Get_Index = function(x, y, W){
        return 4*((y*W)+x);
    };
    this.Apply_Kernel_Mask = function(x_coordinate, y_coordinate, img_width, pixel_arry, kernel){
        var curr = 0, r_sum = 0, g_sum = 0, b_sum = 0, a_sum = 0, avg_denom = 0, i = 0,rgba_avgs;
        if((x_coordinate-kernel) < 0){
            curr = 0, r_sum = 0, g_sum = 0, b_sum = 0, a_sum = 0, avg_denom = 0;
            //console.log("left edge coordinates(x,y):","(",x_coordinate,",",y_coordinate,")");
            //console.log(x_coordinate-kernel.length);
            for(i=(x_coordinate-kernel + Math.abs(x_coordinate-kernel)); i<x_coordinate+kernel; i++){
                curr = this.Get_Index(i, y_coordinate, img_width);
                r_sum += pixel_arry[curr];//*kernel[Math.abs(x_coordinate-i)];
                g_sum += pixel_arry[curr+1];//*kernel[Math.abs(x_coordinate-i)];
                b_sum += pixel_arry[curr+2];//*kernel[Math.abs(x_coordinate-i)];
                a_sum += pixel_arry[curr+3];//*kernel[Math.abs(x_coordinate-i)];
                avg_denom++;
                //console.log("left edge",curr);
                //console.log(i,"red:",pixel_arry[curr]," at:","(",i,",",y_coordinate,") weight:",Math.abs(x_coordinate-i));
                //console.log("red:",r_sum);
            }
            //console.log("edge:",r_sum);
        }else if((x_coordinate+kernel) >= img_width){
            curr = 0, r_sum = 0, g_sum = 0, b_sum = 0, a_sum = 0, avg_denom = 0;
            //console.log("right edge coordinates(x,y):","(",x_coordinate,",",y_coordinate,")");
            //console.log("limit:",img_width,"/i:" ,x_coordinate-kernel.length);
            for(i=x_coordinate-kernel; i<img_width; i++){
                curr = this.Get_Index(i, y_coordinate, img_width);
                r_sum += pixel_arry[curr];//*kernel[Math.abs(x_coordinate-i)];
                g_sum += pixel_arry[curr+1];//*kernel[Math.abs(x_coordinate-i)];
                b_sum += pixel_arry[curr+2];//*kernel[Math.abs(x_coordinate-i)];
                a_sum += pixel_arry[curr+3];//*kernel[Math.abs(x_coordinate-i)];
                avg_denom++;
                //console.log(r_sum,i,pixel_arry[curr],Math.abs(x_coordinate-i),kernel[Math.abs(x_coordinate-i)]);
                //console.log(r_sum);
            }
            //console.log((x_coordinate+kernel.length - Math.abs(x_coordinate-kernel.length)));
        }else {
            curr = 0, r_sum = 0, g_sum = 0, b_sum = 0, a_sum = 0, avg_denom = 0;
            //console.log("no edge coordinates(x,y):","(",x_coordinate,",",y_coordinate,")");
            for(i=x_coordinate-kernel; i<x_coordinate+kernel; i++){
                curr = this.Get_Index(i, y_coordinate, img_width);
                r_sum += pixel_arry[curr];//*kernel[Math.abs(x_coordinate-i)];
                g_sum += pixel_arry[curr+1];//*kernel[Math.abs(x_coordinate-i)];
                b_sum += pixel_arry[curr+2];//*kernel[Math.abs(x_coordinate-i)];
                a_sum += pixel_arry[curr+3];//*kernel[Math.abs(x_coordinate-i)];
                avg_denom++;
                //console.log("no edge",curr);
                //console.log(r_sum);
            }
            //console.log(r_sum);
        }
        //console.log(r_sum, g_sum, b_sum, a_sum);
        rgba_avgs = [r_sum/avg_denom, g_sum/avg_denom, b_sum/avg_denom, a_sum/avg_denom];
        return rgba_avgs;
    };
    this.Avg_Linear_Blurs = function(gauss_y){
        var data = new Array(gauss_y.length);
        for(var i=0; i<gauss_y.length;i++){
            data[i] = gauss_y[i];
        }
        //console.log(data);
        return data;
    };
    this.Apply_Linear_Blurs = function(original_data, img_width, img_height, kernel){
        var RGBA_arry = this.DeepCopy_PxData(original_data);console.log(RGBA_arry);
        var blurred_px;
        var Blurred_dataX = new Array(0);var Blurred_data = new Array(0);
        for(var y = 0; y < img_height; y++){
            for(var x = 0; x < img_width; x++){
                //console.log("(",x,",",y,")");
                blurred_px = this.Apply_Kernel_Mask(x, y, img_width , RGBA_arry, kernel);
                //console.log(blurred_px);
                Blurred_dataX.push(blurred_px[0], blurred_px[1],blurred_px[2], blurred_px[3]);
            }
        }
        //console.log(Blurred_dataX);
      
        Blurred_data = this.Avg_Linear_Blurs(Blurred_dataX);
        //console.log(Blurred_data);
        return Blurred_data;
    };
    this.Apply_Gaussian_Blur = function(){
        //console.log(this.img_width, this.img_height);
        var new_img_data = this.Apply_Linear_Blurs(this.original_data, this.img_width, this.img_height, this.kernel);
        //console.log(new_img_data);
        for(var i=0; i<this.original_data.length; i++){
            this.original_data[i] = new_img_data[i];
        }
        console.log(original_pxData);
        canvas_tool.putImageData(imageData, 0, 0);
    };
};
var smooth = function(){
    console.log("smoothing");
    //var kernel = new SetUp_Gaussian_Kernel();
    //console.log(kernel);
    var kernel = 2;
    //console.log(kernel);
    var smooth = new Gaussian_Filter(data, ctx, canvas, img, kernel);
    smooth.Apply_Gaussian_Blur();
};
var snd2 = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

function beep2() { 
  snd2.play();
}
var DeepCopy_PxData = function(original){
    var new_data_arry = [0];
    new_data_arry.length = original.length;
    for(var i=0; i<original.length; i++){
        new_data_arry[i] = original[i];
    }
    return new_data_arry;
};
var Get_Index = function(x, y, W){
    return 4*((y*W)+x);
};
var Sobel_Edge_Detector = function(original_pxData, canvas_tool ,canvas_obj, original_img){
    this.px_data = original_pxData;
    this.canvas_tool = canvas_tool;
    this.canvas = canvas_obj;
    this.img = original_img;
    this.sobel_x_kernel = [-1,0,-1,-2,0,2,-1,0,1];
    this.sobel_y_kernel = [1,2,1,0,0,0,-1,-2,-1];
    this.DeepCopy_PxData = function(original){
        var new_data_arry = [0];
        new_data_arry.length = original.length;
        for(var i=0; i<original.length; i++){
            new_data_arry[i] = original[i];
        }
        return new_data_arry;
    };
    this.Get_Index = function(x, y, W){
        
        return 4*((y*W)+x);
    };
    this.Sobel = function(data,img_height, img_width, sobel){
        var sobel_0 = 0;var sobel_1 = 0;var sobel_2 = 0;var sobel_3 = 0;var sobel_4 = 0;var sobel_5 = 0;var sobel_6 = 0;var sobel_7 = 0;
        var sobel_8 = 0; var r_px = 0; var g_px = 0; var b_px = 0; var a_px = 0;
        var neighborhood = 0; var px_sobel = new Array(0); var sobel_kernel=0;var corner = 0;
         for(var y=0; y<img_height; y++){
            for(var x=0; x<img_width; x++){
                r_px = 0;g_px = 0;b_px = 0;a_px = 0;
                if((x-1)<0 && (y-1)<0){
                    //console.log("upper left corner kernel");
                    sobel_4 = this.Get_Index(x, y, img_width);
                    sobel_5 = this.Get_Index(x+1, y, img_width);
                    sobel_7 = this.Get_Index(x, y+1, img_width);
                    sobel_8 = this.Get_Index(x+1, y+1, img_width);
                    neighborhood = [sobel_4,sobel_5,sobel_7,sobel_8];
                    sobel_kernel = [sobel[4],sobel[5],sobel[7],sobel[8]];
                    corner++;
                }else if((x+1)>=(img_width-1) && (y+1)>=(img_height-1)){
                    //console.log("lower right kernel");
                    sobel_0 = this.Get_Index(x-1, y-1, img_width);
                    sobel_1 = this.Get_Index(x, y-1, img_width);
                    sobel_3 = this.Get_Index(x-1, y, img_width);
                    sobel_4 = this.Get_Index(x, y, img_width);
                    neighborhood = [sobel_0,sobel_1,sobel_3,sobel_4];
                    sobel_kernel = [sobel[0],sobel[1],sobel[3],sobel[4]];
                    corner++;
                }else if((x-1)<0 && (y+1)>=(img_height-1)){
                    //console.log("lower left corner kernel");
                    sobel_1 = this.Get_Index(x, y-1, img_width);
                    sobel_2 = this.Get_Index(x+1, y-1, img_width);
                    sobel_4 = this.Get_Index(x, y, img_width);
                    sobel_5 = this.Get_Index(x+1, y, img_width);
                    neighborhood = [sobel_1,sobel_2,sobel_4,sobel_5];
                    sobel_kernel = [sobel[1],sobel[2],sobel[4],sobel[5]];
                    corner++;
                }else if((x+1)>=(img_width-1) && (y-1)<0){
                    //console.log("upper right corner kernel");
                    sobel_3 = this.Get_Index(x-1, y, img_width);
                    sobel_4 = this.Get_Index(x, y, img_width);
                    sobel_6 = this.Get_Index(x-1, y+1, img_width);
                    sobel_7 = this.Get_Index(x, y+1, img_width);
                    neighborhood = [sobel_3,sobel_4,sobel_6,sobel_7];
                    sobel_kernel = [sobel[3],sobel[4],sobel[6],sobel[7]];
                    corner++;
                }else if((x-1)<0){
                    //console.log("left edge kernel");
                    sobel_1 = this.Get_Index(x, y-1, img_width);
                    sobel_2 = this.Get_Index(x+1, y-1, img_width);
                    sobel_4 = this.Get_Index(x, y, img_width);
                    sobel_5 = this.Get_Index(x+1, y, img_width);
                    sobel_7 = this.Get_Index(x, y+1, img_width);
                    sobel_8 = this.Get_Index(x+1, y+1, img_width);
                    neighborhood = [sobel_1,sobel_2,sobel_4,sobel_5,sobel_7,sobel_8];
                    sobel_kernel = [sobel[1],sobel[2],sobel[4],sobel[5],sobel[7],sobel[8]];
                }else if((y-1)<0){
                    //console.log("up edge kernel");
                    sobel_3 = this.Get_Index(x-1, y, img_width);
                    sobel_4 = this.Get_Index(x, y, img_width);
                    sobel_5 = this.Get_Index(x+1, y, img_width);
                    sobel_6 = this.Get_Index(x-1, y+1, img_width);
                    sobel_7 = this.Get_Index(x, y+1, img_width);
                    sobel_8 = this.Get_Index(x+1, y+1, img_width);
                    neighborhood = [sobel_3,sobel_4,sobel_5,sobel_6,sobel_7,sobel_8];
                    sobel_kernel = [sobel[3],sobel[4],sobel[5],sobel[6],sobel[7],sobel[8]];
                }else if((x+1)<=(img_width-1)){
                    //console.log("right edge kernel");
                    sobel_0 = this.Get_Index(x-1, y-1, img_width);
                    sobel_1 = this.Get_Index(x, y-1, img_width);
                    sobel_3 = this.Get_Index(x-1, y, img_width);
                    sobel_4 = this.Get_Index(x, y, img_width);
                    sobel_6 = this.Get_Index(x-1, y+1, img_width);
                    sobel_7 = this.Get_Index(x, y+1, img_width);
                    neighborhood = [sobel_0,sobel_1,sobel_3,sobel_4,sobel_6,sobel_7];
                    sobel_kernel = [sobel[0],sobel[1],sobel[3],sobel[4],sobel[6],sobel[7]];
                }else if((y+1)>(img_height-1)){
                    //console.log("down edge kernel");
                    sobel_0 = this.Get_Index(x-1, y-1, img_width);
                    sobel_1 = this.Get_Index(x, y-1, img_width);
                    sobel_2 = this.Get_Index(x+1, y-1, img_width);
                    sobel_3 = this.Get_Index(x-1, y, img_width);
                    sobel_4 = this.Get_Index(x, y, img_width);
                    sobel_5 = this.Get_Index(x+1, y, img_width);
                    neighborhood = [sobel_0,sobel_1,sobel_2,sobel_3,sobel_4,sobel_5];
                    sobel_kernel = [sobel[0],sobel[1],sobel[2],sobel[3],sobel[4],sobel[5]];
                }else{
                    //console.log("normal kernel");
                    sobel_0 = this.Get_Index(x-1, y-1, img_width);
                    sobel_1 = this.Get_Index(x, y-1, img_width);
                    sobel_2 = this.Get_Index(x+1, y-1, img_width);
                    sobel_3 = this.Get_Index(x-1, y, img_width);
                    sobel_4 = this.Get_Index(x, y, img_width);
                    sobel_5 = this.Get_Index(x+1, y, img_width);
                    sobel_6 = this.Get_Index(x-1, y+1, img_width);
                    sobel_7 = this.Get_Index(x, y+1, img_width);
                    sobel_8 = this.Get_Index(x+1, y+1, img_width);
                    neighborhood = [sobel_0,sobel_1,sobel_2,sobel_3,sobel_4,sobel_5,sobel_6,sobel_7,sobel_8];
                    sobel_kernel = [sobel[0],sobel[1],sobel[2],sobel[3],sobel[4],sobel[5],sobel[6],sobel[7],sobel[8]];
                }
                //console.log("x,y:",x,",",y);console.log("w,h:",img_width,",",img_height);
                //console.log("nb:",neighborhood);
                //console.log("kernel:",sobel_kernel);
                var counter = 0;
                for(let neighbor of neighborhood){
                    r_px += data[neighbor] * sobel_kernel[counter];
                    g_px += data[neighbor+1] * sobel_kernel[counter];
                    b_px += data[neighbor+2] * sobel_kernel[counter];
                    //a_px += data[neighbor+3] * sobel_kernel[counter];
                    counter++;
                }
                a_px = data[(this.Get_Index(x, y, img_width) + 3)];
                //console.log(a_px);
                px_sobel.push((r_px/sobel_kernel.length),(g_px/sobel_kernel.length),(b_px/sobel_kernel.length),a_px);
                //console.log("new pixel:",(r_px/sobel_kernel.length),(g_px/sobel_kernel.length),(b_px/sobel_kernel.length),a_px);
                //console.log(neighborhood);
             }
         }
         console.log("corners:",corner);
         return px_sobel;
    };
    this.Sobel_Orientation = function(sobel_1, sobel_2,img_height,img_width){
        var sobel_orientation =  new Array(0);
        var curr_px = 0;var orientation = 0;
        if(sobel_1.length == sobel_2.length){
            //Create array of gradient orientation for thresholding
            for(var y=0; y<img_height; y++){
                for(var x=0; x<img_width; x++){
                    curr_px = this.Get_Index(x,y,img_width);
                    orientation=Math.atan((sobel_1[curr_px]*sobel_1[curr_px])/(sobel_2[curr_px]*sobel_2[curr_px]));
                    sobel_orientation.push(orientation);
                }
            }
        }
        return sobel_orientation;
    };
    this.Combine_Sobel = function(sobel_1, sobel_2,img_height,img_width){
        var r=0; var g=0; var b=0; var a=0; var combined_sobel =  new Array(0);
        if(sobel_1.length == sobel_2.length){
            //Create combined sobel output
            for(var i = 0; i<sobel_1.length; i+=4){
                r=Math.sqrt((sobel_1[i]*sobel_1[i])+(sobel_2[i]*sobel_2[i]));
                g=Math.sqrt((sobel_1[i+1]*sobel_1[i+1])+(sobel_2[i+1]*sobel_2[i+1]));
                b=Math.sqrt((sobel_1[i+2]*sobel_1[i+2])+(sobel_2[i+2]*sobel_2[i+2]));
                a=(sobel_1[i+3] + sobel_2[i+3])/2;
                combined_sobel.push(r,g,b,a);
            }
        }else{
            console.log("Sobel diff lengths");
        }
        return combined_sobel;
    };
    this.Apply_Sobel = function(){
        var x_copy = this.DeepCopy_PxData(this.px_data);
        var sobel_x = this.Sobel(x_copy, this.img.height, this.img.width, this.sobel_x_kernel);
        var y_copy = this.DeepCopy_PxData(this.px_data);
        var sobel_y = this.Sobel(y_copy, this.img.height, this.img.width, this.sobel_y_kernel);
        var sobel_pxls = this.Combine_Sobel(sobel_x, sobel_y,this.img.height, this.img.width);
        return sobel_pxls;
    };
};
var sobel_result;
var sobel_detection = function(){
    console.log("sobel");
    var sobel = new Sobel_Edge_Detector(data, ctx, canvas, img);
    sobel_result = sobel.Apply_Sobel();
    var H = 170;
    var L = 85;
    var copy = DeepCopy_PxData(sobel_result);
    for(var y=0; y<sobel_result.length; y++){
        for(var x=0; x<sobel_result.length;x++){
            var curr = Get_Index(x, y, );
            copy[curr];
        }
    }
    setInterval(beep2, 300);
};
var invert = function() {
    var invertData = data;
    var invert_imageData = imageData;
    for (var i = 0; i < data.length; i += 4) {
      invertData[i]     = 255 - invertData[i];     // red
      invertData[i + 1] = 255 - invertData[i + 1]; // green
      invertData[i + 2] = 255 - invertData[i + 2]; // blue
    }
    ctx.putImageData(invert_imageData, 0, 0);
};
var grayscale_filter = function(original_pxData, canvas_tool) {
    this.data = original_pxData;
    this.grayscale_tool = canvas_tool;
    this.Brightness = function(red, grn, blu)
    {
        return ((0.2126 * red) + (0.7152 * grn) + (0.0722 * blu) + 0.5) ;
    };
    this.Apply_Grayscale = function(){
        console.log(this.data);
        for (var i = 0; i < this.data.length; i += 4) {
          var avg = this.Brightness(this.data[i], this.data[i + 1], this.data[i + 2]);/*(data[i] + data[i + 1] + data[i + 2]) / 3;*/
          /*if(avg>0 && avg<=25){
            avg=0;
          }else if(avg>51 && avg<=102){
            avg=50;
          }else if(avg>102 && avg<=153){
            avg=120;
          }else if(avg>153 && avg<=204){
            avg=200;
          }else if(avg>204 && avg<=255){
            avg=255;
          }*/
          this.data[i]     = avg; // red
          this.data[i + 1] = avg; // green
          this.data[i + 2] = avg; // blue
        }
        console.log(this.data);
        this.grayscale_tool.putImageData(imageData, 0, 0);
    };
};
var grayscale = function(){
    console.log("graying");
    var gray = new grayscale_filter(data, ctx);
    gray.Apply_Grayscale();
};
var resetImg = function(){
    ctx.drawImage(img, 0, 0);
    //ctx.putImageData(imageData, 0, 0);
};