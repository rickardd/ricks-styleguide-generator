const regEx = {
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

module.exports.parser = {
  block: {
    getAllAsArray: string => string.match(regEx.block.raw),
    getTitle: string => string.match(regEx.block.title),
    getItems: string => string.match(regEx.block.items),
    getItemKey: string => string.match(regEx.block.itemKey)[0].trim(),
    getItemValue: string => string.match(regEx.block.itemValue)[0].trim(),
    section: {
      getAllAsArray: string => string.match(regEx.block.sections),
      getTitleAndDescription: string => string.match(regEx.block.section.titleAndDescription),
      getItemKey: string => string.match(regEx.block.section.itemKey)[0].trim(),
      getItemValue: string => string.match(regEx.block.section.itemValue)[0].trim(),
      replaceCssClass: (string, cssClass) => string.replace(regEx.block.section.classReplacer, cssClass),
    }
  },
  iconset: {
    getAllAsArray: string => string.match(regEx.iconset.raw),
    getBlock: string => string.match(regEx.iconset.block),
    getName: string => string.match(regEx.iconset.name),
    getMarkup: string => string.match(regEx.iconset.markup),
    getCssClass: string => string.match(regEx.iconset.cssClass),
    getCssClassInfo: string => string.match(regEx.iconset.cssClassInfo),
  }
}








