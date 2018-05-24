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
  populateObject: ( items, obj ) => {
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
  }

}

module.exports.blockLib = blockLib