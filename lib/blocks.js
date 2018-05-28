const { parser } = require('./regEx')
const util = require('util')
const { clRed, clGreen, clBlue, clYellow } = require('./console')
const { compose, pipe } = require('./utils')


// -- Pure
const getKeyAndValue = ( item ) => ({
  key: parser.block.getItemKey( item ),
  value: parser.block.getItemValue( item )
})

// -- Pure
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

// -- Pure
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

// -- Pure
const appendParsedMarkupToSection = section => {
    return  section.classes.map( s => {
        return parser.block.section.replaceCssClass(
            section.markup,
            s.value.replace(/\./g, '')
          )
    })
}

// -- Pure
const populateSectionObject = sections => {
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