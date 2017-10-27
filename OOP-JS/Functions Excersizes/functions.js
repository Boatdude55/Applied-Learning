/**
1.Write a function that converts a hexadecimal color,
  for example blue (#0000FF), into its RGB representation, rgb(0, 0, 255).
  Name your function getRGB() and test it with the following code
  (hint: treat the string as an array of characters):
**/

function getRGB ( hex ) {

    let rgbStr = "rgb(", newDec = 0;
    let rgbVals = [];
    let exponent = 1;
    for( let j = 1 ; j <= hex.length ; j++ ) {

        if( j > 1 && j % 2 !== 0){
            rgbVals.push(newDec);
            newDec =  0;
            exponent = 1;
        }

        newDec += parseInt(hex[j], 16) * Math.pow(16 , exponent);
        exponent--;
    }
    rgbStr = rgbStr + rgbVals.toString() + ')';
    return rgbStr;
}

console.log(getRGB("#0000FF"));