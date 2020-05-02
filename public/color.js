var chromatism = require('chromatism');

//   console.log("this is a test",test)
// this will return the best matching outfits
function match(targeOutFit, allOutFits) {
  // return for testing, them all
  // console.log(targeOutFit, 'userO')
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

  console.log(outfits, 'clothes too match')
  // console.log(colorMatches, "cMatches")

  let result;

  outfits.forEach(outfitColors => {

    dance:
    for (let index = 0; index < colorMatches[0].length; index++) {

      let rgb = colorMatches[index];

      for (let i = 0; i < rgb.length; i++) {
        let colors = rgb[i];      
        let stuff = (colors.r + 20 > outfitColors.r && colors.r - 20 < outfitColors.r && colors.g + 20 > outfitColors.g && colors.g - 20 < outfitColors.g && colors.b + 20 > outfitColors.b && colors.b - 20 < outfitColors.b)
        if (stuff) {
          console.log("success");
          result = true
          break dance
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