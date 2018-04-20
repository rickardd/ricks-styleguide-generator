const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const Dim = "\x1b[2m";
const Underscore = "\x1b[4m";
const Blink = "\x1b[5m";
const Reverse = "\x1b[7m";
const Hidden = "\x1b[8m";

const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";

const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";

console.clear();
console.red = (msg) => {
  console.log(FgRed, msg, Reset)
}
console.green = (msg) => {
  console.log(FgGreen, msg, Reset)
}
console.blue = (msg) => {
  console.log(FgBlue, msg, Reset)
}

let fs = require("fs");
let path = require('path');

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
          console.red(filePath + ' - ' + error)
          resolve()
        }
      )
    })
  })
}


function fromDir(startPath, extension){
    console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)){
        console.red("no dir " + startPath);
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
          console.green('-- found: ' + filename);
          treatFilePromises.push( treatFile(filename) );
      };
    });

    Promise.all( treatFilePromises ).then( () => {
      console.green('ALL FILES DONE!')
      console.log(blocks)
    })
};


var start = () => {
  fromDir('./test-css', '.css');
}

start();

// let blocks = str.match(/\bStyleguide:[\s\S]*?(?<=end|$)/gi);

// let styleguide = [];
// console.clear();
// blocks.forEach( function( block ){
//   let obj = {};
//   let title = block.match(/(?<=styleguide:).*;/i);
//   obj.title = !!title ? title[0].trim() : null;

//   let descriptions = block.match(/(?<=description:).*;/gi);
//   obj.descriptions = !!descriptions && descriptions.length
//     ? descriptions.map( d => d.trim() )
//     : null;

//   let template = block.match(/(?<=template:).*;/gi);
//   obj.template = !!template
//     ? template[0].trim()
//     : null;

//   let markups = block.match(/(?<=markup:).*;/gi);
//   obj.markups = !!markups && markups.length
//     ? markups.map( m => m.trim() )
//     : null;

//   styleguide.push(obj);
// });

// console.dir(styleguide);