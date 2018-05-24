module.exports.regEx = {
  block: {
    raw: /(?<=\/\*\*@).+(?=@\*\/)/gmis, // to parse all style guide blocks in a file
    title: /(?<=@#).+?;/gmis, // to parse block title
    items: /(@title|@markup|@description|@class).*?(?=;)/gmis, // to parse block items such as @title, @markup, @description, @class
    sections: /(?<=@--).+?(?=(@\/-))/gmis, // to parse each section within a block
    itemKey: /(@#|@description)/gmis,
    itemValue: /(?<=@#|@description).+$/gmis,
    section: {
      titleAndDescription: /(@#|@description).*?(?=;)/gmis, // to parse block title and descriptions
      itemKey: /(@title|@markup|@description|@class)/gmis, // to parse the key for each item e.g @description will return description
      itemValue: /(?<=@title|@markup|@description|@class).+$/gmis, // to parse the value for each item e.g @description lorem ipsum will return "lorem ipsum"
      classReplacer: /({{class}}|{{ class }})/gmis,
    }
  },
  iconset: {
    raw: /(?<=\/\*\*@)iconset-.+?(?=\/\*\*@\/iconset)/gsmi,
    block: /((\.).+?(?={)|@info\s.+?(?={))/gsmi,
    name: /(?<=iconset-).+\b/i,
    markup: /(?<=@markup\s).+/i,
    cssClass: /\..+?(?=:|{|\s)/gmi,
    cssClassInfo: /(?<=@info\s).*/i,
  }
}