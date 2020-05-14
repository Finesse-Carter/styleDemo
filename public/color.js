var chromatism = require('chromatism');
//In this function,is storing all of the RGB values of the clothing that the user has uploaded 
//and the specific image RGB’s values of the images the user wants to match.

/* this will return the best matching outfits.*/

function match(targeOutFit, allOutFits) {
  // return for testing, them all
  let colorMatches = [];

  targeOutFit.forEach(colour => {
    let reccomendedColors = chromatism.uniformTetrad(colour).rgb;
    colorMatches.push(reccomendedColors)
  })

  let userOutfits = allOutFits;

  let rgbOutfitMatches = userOutfits.filter((rgb =>
    checkRGBMatches(rgb.colors, colorMatches)
  ))
  return rgbOutfitMatches;
}

function checkRGBMatches(outfits, colorMatches) {

  
  let result;
// This is the color matching algorithm, where I loop through every outfit and then compare there RGB values to 
// the outfits the user is trying to match and if we find complementary colors then return that outfit.

  outfits.forEach(outfitColors => {

    match:
    for (let index = 0; index < colorMatches[0].length; index++) {

      let rgb = colorMatches[index];

      for (let i = 0; i < rgb.length; i++) {
        let colors = rgb[i];      
        let stuff = (colors.r + 20 > outfitColors.r && colors.r - 20 < outfitColors.r && colors.g + 20 > outfitColors.g && colors.g - 20 < outfitColors.g && colors.b + 20 > outfitColors.b && colors.b - 20 < outfitColors.b)
        if (stuff) {
          result = true
          break match
        } else {
          result = false
        }
      }
    }
  })
  return result;
}

module.exports = {
  match
}