console.clear()
const util = require('util')
const fs = require("fs")
const path = require('path')
const htmlParser = require('./htmlGenerator')
const {clRed, clGreen, clBlue } = require('./console')
const file = require('./file')
const { regEx } = require('./lib/regEx')

let blocks = [];
let iconSets = [];

function getBlocks(fileString) {

    return new Promise(function(resolve, reject) {
        let _blocks = fileString.match(regEx.block.raw);
        if (!_blocks) {
            reject('No recognised styleguide comments')
            return
        }
        _blocks.forEach(block => {
            let _block = {
                title: null,
                descriptions: [],
                sections: [

                ]
            }

            let _items = block.match(regEx.block.section.titleAndDescription);
            _items.forEach(item => {

                let key = item.match(regEx.block.itemKey)[0].trim();
                let value = item.match(regEx.block.itemValue)[0].trim();

                if (key === '@#') {
                    _block.title = value
                }
                if (key === '@description') {
                    _block.descriptions.push(value)
                }
            })

            let _sections = block.match(regEx.block.sections)
            _sections.forEach(section => {
                let _sectionItems = section.match(regEx.block.items)
                let _section = {
                    classes: [],
                    descriptions: [],
                    parsedMarkups: [],
                    markup: null,
                }
                _sectionItems.forEach(sectionItem => {

                    const _key = sectionItem.match(regEx.block.section.itemKey)[0].trim()
                    const _value = sectionItem.match(regEx.block.section.itemValue)[0].trim()

                    if (_key === '@class') {
                        _section.classes.push({
                            key: _key,
                            value: _value,
                        })
                    }

                    if (_key === '@description') {
                        _section.descriptions.push(_value)
                    }

                    if (_key === '@markup') {
                        _section.markup = _value
                    }
                })

                _section.classes.forEach( obj => {
                  let className = obj.value.replace(/\./g, '')
                  let _parsedMarkup = _section.markup.replace(regEx.block.section.classReplacer, className);
                  // console.log(_parsedMarkup)
                  _section.parsedMarkups.push( _parsedMarkup )
                })
                _block.sections.push(_section)
            })
            blocks.push(_block);
            // clBlue(util.inspect(blocks, false, null))
        });
        resolve()
    })
}



function getIconSets(fileString) {
    return new Promise(function(resolve, reject) {
        let _iconSets = fileString.match(regEx.iconset.raw);
        if (!_iconSets) {
            reject('No recognised styleguide iconset')
            return
        }
        clGreen( 'Styleguide Icon Set found')
        _iconSets.forEach(set => {
          let title = set.match(regEx.iconset.name)
          let markup = set.match(regEx.iconset.markup)

          title = !!title ? title[0] : null
          markup = !!markup ? markup[0].replace(/\*\//i, '') : null

          let _iconBlockObj = {
              title: title,
              markup: markup,
              cssClasses: []
          }
          let _iconBlock = set.match(regEx.iconset.block)
          _iconBlock.forEach(block => {

            let info = block.match(regEx.iconset.cssClassInfo)
            let cssClass = block.match(regEx.iconset.cssClass)
            let parsedMarkup = null

            info = (!!info) ? info[0].replace('\*\/', '').trim() : null // trims and strips trailing */ if block comment
            cssClass = cssClass.splice(',').map( c => c.replace(/:before/i, '').trim() ) // creates an array and trim e.g ['.one', ',two']

            if( !!markup ){
              let parsedCssClass = cssClass[0].replace(/^(\.|#)/i, ''); // strips . and # from beginning of class
              parsedMarkup = markup.replace(regEx.block.section.classReplacer, parsedCssClass);
            }
            console.log(parsedMarkup)
            _iconBlockObj.cssClasses.push({
              info: info,
              cssClass: cssClass,
              markup: parsedMarkup
            })
          })
          iconSets.push(_iconBlockObj)
        })
        clGreen(util.inspect(iconSets, false, null))
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