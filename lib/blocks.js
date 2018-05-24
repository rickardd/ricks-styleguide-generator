const { parser } = require('./regEx')

module.exports.blockLib = {

  getKeyAndValue: ( item ) => {
    let key = parser.block.getItemKey( item )
    let value = parser.block.getItemValue( item );

    return {
      key: key,
      value: value,
    }
  }
}



