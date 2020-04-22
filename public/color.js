var ColorThief = require('color-thief');
  var chromatism = require('chromatism');

var colorThief = new ColorThief();
let primeColor = colorThief.getColor(req.file.path);
let colorPalette = colorThief.getPalette( req.file.path, 8);
//+++++++++++++
console.log("colorPalette",colorPalette[0]);
console.log("primecolor",primeColor);
 let test = colorPalette.forEach(colorx =>{
chromatism.complementary(colorx).rgb
  })
  
  var newColour = chromatism.complementary( colour ).rgb;
  console.log("this is a test",test)
console.log( newColour);
