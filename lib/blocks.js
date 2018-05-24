const { parser } = require('./regEx')

const blockLib = {

  getKeyAndValue: ( item ) => {
    let key = parser.block.getItemKey( item )
    let value = parser.block.getItemValue( item );

    return {
      key: key,
      value: value,
    }
  },

  // Adds title and description to past in object.
  populateObject: ( items ) => {
    return items.reduce( ( acc, curr ) => {
        const obj = blockLib.getKeyAndValue( curr ) // { e.g {key: foo, value: bar}}
        if (obj.key === '@#') acc.title = obj.value
        if (obj.key === '@description') acc.descriptions.push(obj.value)
        return acc
    },
    {
      title: null,
      descriptions: [],
      sections: []
    })
  },


  // ToDo: Refactro to a reducer function
  populateSectionObject: ( sections ) => {
    const returnArray = []
    sections.forEach(section => {
        let _sectionItems = parser.block.getItems( section )
        let _section = {
            classes: [],
            descriptions: [],
            parsedMarkups: [],
            markup: null,
        }
        _sectionItems.forEach(sectionItem => {

            const _key = parser.block.section.getItemKey( sectionItem )
            const _value = parser.block.section.getItemValue( sectionItem )

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
          let _parsedMarkup = parser.block.section.replaceCssClass( _section.markup, className )
          _section.parsedMarkups.push( _parsedMarkup )
        })
        returnArray.push(_section)
    })
    return returnArray
  }

}

module.exports.blockLib = blockLib