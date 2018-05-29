const expect = require('chai').expect
const { getKeyAndValue, populateObject, getSectionItemObjects } = require('../lib/blocks.js')

describe('getKeyAndValue()', function () {
  it('should return a single object with key and value for @#', function () {
    let str = `@# Icons`
    let res = getKeyAndValue(str);
    expect(res).to.eql(
      {
        key: '@#',
        value: 'Icons'
      }
    );
  });

  it('should return a single object with key and value for @description', function () {
    let str = ` @description Lorem ipsum dolar sit amet `
    let res = getKeyAndValue(str);
    expect(res).to.eql(
      {
        key: '@description',
        value: 'Lorem ipsum dolar sit amet'
      }
    );
  });

});


describe('populateObject()', function () {
  // let str = `
  //     @markup <a class="{{class}}">link</a>;

  //     @title section title;

  //     @description
  //     SECTION rick Lorem ipsum
  //     dolar sit amet;

  //     @class .icon-1;
  //     @class .icon-2;
  //     @class .icon-3;

  //     @description
  //     rick Lorem ipsum
  //     dolar sit amet;`

  let items = [
    '@# Icons',
    '@description Test1 Lorem ipsum  dolar sit amet',
    '@description Lorem ipsum  dolar sit amet',
    '@description Test2 Lorem ipsum  dolar sit amet',
  ]

  let res = populateObject(items);

  // res should be something like this...
  // {
  //   title: 'Icons',
  //   descriptions: [
  //      'Test1 Lorem ipsum\n  dolar sit amet',
  //      'Lorem ipsum\n  dolar sit amet',
  //      'Test2 rick Lorem ipsum\n  dolar sit amet',
  //   ],
  //   sections: []
  // }

  it('should return a single object with title, descriptions, sections', function () {
    expect(res).to.have.all.keys('title', 'descriptions', 'sections')
  });

  it('should return a single object of type object', function () {
    expect(res).to.be.an('object')
  });

  it('should res.title should contain Icons', function () {
    expect(res.title.trim()).to.equal('Icons')
  });

  it('should res.descriptions[0] should contain Test1', function () {
    expect(res.descriptions[0]).to.include('Test1')
  });

  it('should res.descriptions[2] should contain Test2', function () {
    expect(res.descriptions[2]).to.include('Test2')
  });

  it('should res.descriptions length to equal to 3', function () {
    expect(res.descriptions.length).to.equal(3)
  });

});


describe('getSectionItemObjects()', function (){

  let str = `
    @markup <a class="{{class}}">link</a>;

    @title section title;

    @description
      Test1 Lorem ipsum
      dolar sit amet;

    @class .icon-1;
    @class .icon-2;
    @class .icon-3;

    @description
      Test2 Lorem ipsum
      dolar sit amet;`

    let res = getSectionItemObjects(str)

    // res should be something like this...
    // {
    //   classes: [
    //     {
    //       key: '@class',
    //       value: '.icon-1'
    //     },
    //    {
    //       key: '@class',
    //       value: '.icon-2'
    //     },
    //    {
    //       key: '@class',
    //       value: '.icon-3'
    //     }
    //   ],
    //   descriptions: [
    //     'SECTION rick Lorem ipsum\n      dolar sit amet',
    //     'rick Lorem ipsum\n      dolar sit amet'
    //   ],
    //   parsedMarkups: [],
    //   markup: '<a class="{{class}}">link</a>'
    // }

    it('should return a single object with classes[], descriptions[], parsedMarkups[] and markup<string>', function () {
      expect(res).to.have.all.keys('classes', 'descriptions', 'parsedMarkups', 'markup')
    });

    it('should return a single object of type object', function () {
      expect(res).to.be.an('object')
    });

    it('res.classes[0].key.trim() should be equal to "@class"', function () {
      expect(res.classes[0].key.trim()).to.equal('@class')
    });

    it('res.classes[0].value.trim() should be equal to "@class"', function () {
      expect(res.classes[0].value.trim()).to.equal('.icon-1')
    });

    it('should res.descriptions length to equal to 2', function () {
      expect(res.descriptions.length).to.equal(2)
    });

})
