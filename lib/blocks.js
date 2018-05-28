const { parser } = require('./regEx')
const util = require('util')
const { clRed, clGreen, clBlue, clYellow } = require('./console')

const getKeyAndValue = ( item ) => ({
  key: parser.block.getItemKey( item ),
  value: parser.block.getItemValue( item )
})

// Adds title and description to past in object.
const populateObject = ( items ) => {
  return items.reduce( ( acc, curr ) => {
      const obj = getKeyAndValue( curr ) // { e.g {key: foo, value: bar}}
      if (obj.key === '@#') acc.title = obj.value
      if (obj.key === '@description') acc.descriptions.push(obj.value)
      return acc
  },
  {
    title: null,
    descriptions: [],
    sections: []
  })
}


  // ToDo: Refactro to a reducer function
  // populateSectionObject: ( sections ) => {
  //   const returnArray = []
  //   sections.forEach(section => {
  //       let _sectionItems = parser.block.getItems( section )
  //       let _section = {
  //           classes: [],
  //           descriptions: [],
  //           parsedMarkups: [],
  //           markup: null,
  //       }
  //       _sectionItems.forEach(sectionItem => {

  //           const _key = parser.block.section.getItemKey( sectionItem )
  //           const _value = parser.block.section.getItemValue( sectionItem )

  //           if (_key === '@class') {
  //               _section.classes.push({
  //                   key: _key,
  //                   value: _value,
  //               })
  //           }

  //           if (_key === '@description') {
  //               _section.descriptions.push(_value)
  //           }

  //           if (_key === '@markup') {
  //               _section.markup = _value
  //           }
  //       })

  //       _section.classes.forEach( obj => {
  //         let className = obj.value.replace(/\./g, '')
  //         let _parsedMarkup = parser.block.section.replaceCssClass( _section.markup, className )
  //         _section.parsedMarkups.push( _parsedMarkup )
  //       })
  //       returnArray.push(_section)
  //   })
  //   return returnArray
  // }


const getSectionItemObjects = section => {
  return parser.block.getItems( section )
      .reduce( (acc, sectionItem ) => {

        const _key = parser.block.section.getItemKey( sectionItem )
        const _value = parser.block.section.getItemValue( sectionItem )

        if (_key === '@class')
            acc.classes.push({key: _key, value: _value, })

        if (_key === '@description')
            acc.descriptions.push(_value)

        if (_key === '@markup')
            acc.markup = _value

        return acc
    },
    {
        classes: [],
        descriptions: [],
        parsedMarkups: [],
        markup: null,
    })
}

const appendParsedMarkupToSection = section => {
    return  section.classes.map( s => {
        return parser.block.section.replaceCssClass(
            section.markup,
            s.value.replace(/\./g, '')
          )
    })
}

const populateSectionObject = ( sections ) => {
  return sections.reduce( ( acc, section ) => {
    let _section = getSectionItemObjects( section )
    _section.parsedMarkups = appendParsedMarkupToSection( _section)
    acc.push(_section)
    return acc
  }, [] )
}

module.exports = {
  populateObject: populateObject,
  populateSectionObject: populateSectionObject,
}