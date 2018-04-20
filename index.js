console.clear();
let fs = require("fs");
let path = require('path');
let htmlParser = require('./htmlGenerator');
let {clRed, clGreen, clBlue} = require('./console');

let blocks = [];

function getFileAsString( filePath ){
  return new Promise( (resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      resolve(data);
    });
  })
}

function getBlocks( fileString ){
  return new Promise(function(resolve, reject) {
    let blocks = fileString.match(/\bStyleguide:[\s\S]*?(?<=end|$)/gi);
    let styleguide = [];
    if ( !blocks ) {
      reject('No recognised styleguide comments')
      return
    }
    blocks.forEach( function( block ){
      let obj = {};
      let title = block.match(/(?<=styleguide:).*;/i);
      obj.title = !!title ? title[0].trim() : null;

      let descriptions = block.match(/(?<=description:).*;/gi);
      obj.descriptions = !!descriptions && descriptions.length
        ? descriptions.map( d => d.trim() )
        : null;

      let template = block.match(/(?<=template:).*;/gi);
      obj.template = !!template
        ? template[0].trim()
        : null;

      let markups = block.match(/(?<=markup:).*;/gi);
      obj.markups = !!markups && markups.length
        ? markups.map( m => m.trim() )
        : null;

      styleguide.push(obj);
    });
    resolve(styleguide)
  })
}

function treatFile( filePath ) {
  return new Promise( (resolve, reject) => {
    getFileAsString( filePath ).then( fileString => {
      getBlocks( fileString ).then(
        commentBlocks => {
          blocks.push( commentBlocks )
          resolve()
        },
        error => {
          clRed(filePath + ' - ' + error)
          resolve()
        }
      )
    })
  })
}


function fromDir(startPath, extension){
    console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        clRed("no dir " + startPath);
        return;
    }

    let files = fs.readdirSync(startPath);

    let treatFilePromises = []

    files.forEach( file => {
      let filename = path.join(startPath, file);
      let stat = fs.lstatSync(filename);
      if (stat.isDirectory()){
          fromDir(filename, extension); //recurse
      }
      else if (filename.indexOf(extension)>=0) {
          clGreen('-- found: ' + filename);
          treatFilePromises.push( treatFile(filename) );
      };
    });

    Promise.all( treatFilePromises ).then( () => {
      clGreen('ALL FILES DONE!')
      console.log(blocks)
      htmlParser.generate(blocks)
    })
};




var init = () => {
  fromDir('./test-css', '.css');
}

init();
