const fs = require('fs')
const {clRed, clGreen, clBlue} = require('./console')

function getFileAsString( filePath ){
  return new Promise( (resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      resolve(data);
    });
  })
}

function saveToFile( dist, html ){
  return new Promise( (resolve, reject) => {
    fs.writeFile(dist, html, (err) => {
      if (err) throw err;
      clGreen('File have been saved to' + dist);
    });
  })
}

module.exports.getAsString = getFileAsString
module.exports.save = saveToFile