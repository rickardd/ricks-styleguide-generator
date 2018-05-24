const {clRed, clGreen, clBlue} = require('./console');
const CONFIG = require('../config')
const fs = require('fs')
const file = require('./file')
const Mustache = require('mustache')

let blocks;
let icons;

let parseMustache = ( htmlStr ) => {
  obj = {
    title: CONFIG.title,
    blocks: blocks,
    iconSets: icons
  }
  return Mustache.render(htmlStr, obj);
}

let parse = () => {
  const path = `${CONFIG.src}/${CONFIG.templateSrc}`;
  // clBlue('path:', path)
  if (!fs.existsSync(CONFIG.src)){
      clRed("Src folder not found " + CONFIG.src);
      return;
  }
  return new Promise( ( resolved, rejected) => {
    file.getAsString(path).then( ( htmlStr ) => {
      let mustacheParsedHtml = parseMustache( htmlStr )
      resolved(mustacheParsedHtml)
      if(!mustacheParsedHtml){
        rejected("couldn't parse mustache template")
      }
    })
  })

}

let saveToFile = (html) => {
  // clBlue(CONFIG.templateDist)
  // clBlue(html)
  //ToDo: make this work
  // const path = `${CONFIG.dist}/${CONFIG.templateDist}`
  const path = CONFIG.templateDist
  file.save(path, html)
}

let generate = function ( _blocks, _iconSet ) {
  blocks = _blocks
  icons = _iconSet
  let html = parse().then(
    data => {
      saveToFile(data);
    },
    err => {
      clRed(err)
    }
  )
}

module.exports.generate = generate
