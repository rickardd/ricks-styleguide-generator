console.clear()
const util = require('util')
const fs = require("fs")
const path = require('path')
const htmlParser = require('./htmlGenerator')
const {clRed, clGreen, clBlue } = require('./console')
const file = require('./file')
const blockRegEx = /(?<=\/\*\*@).+(?=@\*\/)/gmis
const blockTitleRegEx = /(?<=@#).+?;/gmis
const itemsRegEx = /(@title|@markup|@description|@class).*?(?=;)/gmis
const blockSectionsRegEx = /(?<=@--).+?(?=(@\/-))/gmis
const titleDescSectionRegEx = /(@#|@description).*?(?=;)/gmis
const blockKeyRegEx = /(@#|@description)/gmis
const blockValueRegEx = /(?<=@#|@description).+$/gmis
const itemKeyRegEx = /(@title|@markup|@description|@class)/gmis
const itemValueRegEx = /(?<=@title|@markup|@description|@class).+$/gmis
const parseMarkupRegEx = /({{class}}|{{ class }})/gmis

let blocks = [];

function getBlocks(fileString) {

    return new Promise(function(resolve, reject) {
        let _blocks = fileString.match(blockRegEx);
        if (!_blocks) {
            reject('No recognised styleguide comments')
            return
        }
        // console.clear()
        _blocks.forEach(block => {
            console.log('---')
            let _block = {
                title: null,
                descriptions: [],
                sections: [

                ]
            }

            let _items = block.match(titleDescSectionRegEx);
            _items.forEach(item => {

                let key = item.match(blockKeyRegEx)[0].trim();
                let value = item.match(blockValueRegEx)[0].trim();

                if (key === '@#') {
                    _block.title = value
                }
                if (key === '@description') {
                    _block.descriptions.push(value)
                }
            })

            let _sections = block.match(blockSectionsRegEx)
            _sections.forEach(section => {
                let _sectionItems = section.match(itemsRegEx)
                let _section = {
                    classes: [],
                    descriptions: [],
                    parsedMarkups: [],
                    markup: null,
                }
                _sectionItems.forEach(sectionItem => {

                    const _key = sectionItem.match(itemKeyRegEx)[0].trim()
                    const _value = sectionItem.match(itemValueRegEx)[0].trim()

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
                  let _parsedMarkup = _section.markup.replace(parseMarkupRegEx, className);
                  console.log(_parsedMarkup)
                  _section.parsedMarkups.push( _parsedMarkup )
                })
                _block.sections.push(_section)
            })
            blocks.push(_block);
            clBlue(util.inspect(blocks, false, null))
        });
        resolve()
    })
}




function treatFile(filePath) {
    return new Promise((resolve, reject) => {
        file.getAsString(filePath).then(fileString => {
            getBlocks(fileString).then(
                commentBlocks => {
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
        console.log(blocks)
        htmlParser.generate(blocks)
    })
};

var init = () => {
    fromDir('./test-css', '.css');
}

init();