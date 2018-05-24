console.clear()
const util = require('util')
const fs = require("fs")
const path = require('path')
const htmlParser = require('./lib/html-generator')
const { clRed, clGreen, clBlue } = require('./lib/console')
const file = require('./lib/file')
const { parser } = require('./lib/regEx')
const { blockLib } = require('./lib/blocks')

let blocks = [];
let iconSets = [];

function getBlocks(fileString) {

    return new Promise(function(resolve, reject) {
        let _blocks = parser.block.getAllAsArray(fileString)
        if (!_blocks) {
            reject('No recognised styleguide comments')
            return
        }
        _blocks.forEach(block => {
            // ToDo Coudl this be a composer case?
            let parsedBlocks = parser.block.section.getTitleAndDescription( block );
            const _block = blockLib.populateObject( parsedBlocks )

            // ToDo Coudl this be a composer case?
            const parsedSections = parser.block.section.getAllAsArray( block )
            _block.sections = blockLib.populateSectionObject( parsedSections )

            blocks.push(_block);
            // clBlue(util.inspect(blocks, false, null))
        });
        resolve()
    })
}

function getIconSets(fileString) {
    return new Promise(function(resolve, reject) {
        let _iconSets = parser.iconset.getAllAsArray(fileString)
        if (!_iconSets) {
            reject('No recognised styleguide iconset')
            return
        }
        clGreen( 'Styleguide Icon Set found')
        _iconSets.forEach(set => {
          let title = parser.iconset.getName( set )
          let markup = parser.iconset.getMarkup( set )

          title = !!title ? title[0] : null
          markup = !!markup ? markup[0].replace(/\*\//i, '') : null

          let _iconBlockObj = {
              title: title,
              markup: markup,
              cssClasses: []
          }
          let _iconBlock = parser.iconset.getBlock( set )
          _iconBlock.forEach(block => {

            let info = parser.iconset.getCssClassInfo( block )
            let cssClass = parser.iconset.getCssClass( block )
            let parsedMarkup = null

            info = (!!info) ? info[0].replace('\*\/', '').trim() : null // trims and strips trailing */ if block comment
            cssClass = cssClass.splice(',').map( c => c.replace(/:before/i, '').trim() ) // creates an array and trim e.g ['.one', ',two']

            if( !!markup ){
              let parsedCssClass = cssClass[0].replace(/^(\.|#)/i, ''); // strips . and # from beginning of class
              parsedMarkup = parser.block.section.replaceCssClass( markup, parsedCssClass);
            }
            // console.log(parsedMarkup)
            _iconBlockObj.cssClasses.push({
              info: info,
              cssClass: cssClass,
              markup: parsedMarkup
            })
          })
          iconSets.push(_iconBlockObj)
        })
        // clGreen(util.inspect(iconSets, false, null))
        resolve()
    })
}


function treatFile(filePath) {
    let promiseArray = [];
    return new Promise((resolve, reject) => {
        file.getAsString(filePath).then(fileString => {
            promiseArray.push( new Promise( (resolve, error)  => {
              getBlocks(fileString).then(
                  commentBlocks => {
                      resolve()
                  },
                  error => {
                      clRed(filePath + ' - ' + error)
                      resolve()
                  }
              )
            }))
            promiseArray.push( new Promise( (resolve, error)  => {
              getIconSets(fileString).then(
                iconSets => {
                    resolve()
                },
                error => {
                    clRed(filePath + ' - ' + error)
                    resolve()
                }
              )
            }))
            Promise.all( promiseArray ).then( () => {
              resolve() // resolves first/parent/function- promise
            })
        })
    })
}

function fromDir(startPath, extension) {
    if (!fs.existsSync(startPath)) {
        clRed("no dir " + startPath);
        return;
    }
    let files = fs.readdirSync(startPath);
    let treatFilePromises = []
    files.forEach(file => {
        let filename = path.join(startPath, file);
        let stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, extension); //recurse
        } else if (filename.indexOf(extension) >= 0) {
            clGreen('-- found: ' + filename);
            treatFilePromises.push(treatFile(filename));
        };
    });
    // todo return promise.
    Promise.all(treatFilePromises).then(() => {
        clGreen('ALL FILES DONE!')
        // console.log(blocks)
        htmlParser.generate(blocks, iconSets)
    })
};

var init = () => {
    fromDir('./test-css', '.css');
}

init();