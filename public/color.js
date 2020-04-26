// console.log( newColour);
var chromatism = require('chromatism');
  
//   console.log("this is a test",test)
// this will return the best matching outfits
function match(targeOutFit,allOutFits){
// return for testing, them all
// console.log(targeOutFit, 'userO')
let colorMatches = [];

targeOutFit.forEach(colour => {
let reccomendedColors=chromatism.uniformTetrad( colour ).rgb;
  colorMatches.push(reccomendedColors)
})

let userOutfits = allOutFits;


let rgbOutfitMatches = userOutfits.filter(( rgb =>
 checkRGBMatches(rgb.colors, colorMatches)
 ))
return rgbOutfitMatches;
}

function checkRGBMatches( outfits, colorMatches){

  console.log(outfits, 'clothes too match' )
// console.log(colorMatches, "cMatches")

let result;

outfits.forEach( outfitColors => {

dance:
  for (let index = 0; index < colorMatches[0].length; index++) {

    let rgb = colorMatches[index];

  for (let i = 0; i < rgb.length; i++) {
    let colors = rgb[i];

    // console.log(colors,'colors recom' )
    // console.log(outfitColors,'outfits to wear' )
    let stuff =(colors.r + 20 > outfitColors.r && colors.r - 20 < outfitColors.r) 
    if(stuff){
      // console.log("success");
      
       result = true
       break dance
      
    }else {
      // console.log("failure");
      
      result = false
    }
    
  }

    
  }

  // colorMatches[0].forEach(rgb => {
  //   // console.log(rgb.r + 20 > 40 && rgb.r - 20 < 40, "wooooooooooooooooooooooooooooooooooooooooooooooooooork")
  //   console.log(rgb.r + 20 > outfitColors.r && rgb.r -20 < outfitColors.r, "wooooooooooooooooooooooooooooooooooooooooooooooooooork")

  //   console.log(rgb.r + 20, rgb.b - 30, rgb.g -20,  'rgb')
  //   console.log(outfitColors.r, outfitColors.g, outfitColors.b, 'outfit r')
  //   console.log((rgb.r + 20 > outfitColors.r && rgb.r - 30  < outfits.r && rgb.b -30 > outfitColors.b && rgb.b - 20 < outfits.b && rgb.g + 20 > outfitColors.g && rgb.g - 30 < outfits.g ), 'bool')
  //   // if(rgb.r + 20 > outfitColors.r && rgb.r - 20  < outfits.r && rgb.b + 20 > outfitColors.b && rgb.b - 20 < outfits.b && rgb.g + 20 > outfitColors.g && rgb.g - 20 < outfits.g ){
  //   let stuff =(rgb.r + 20 > outfitColors.r && rgb.r - 30) 
  //   if(stuff){
  //     console.log("seccses");
      
  //      result = true
  //      return
      
  //   }else {
  //     console.log("failer");
      
  //     result = false
  //   }
  //     })
})
console.log(result, 'heyyy');

return result;


}


module.exports ={
match
}