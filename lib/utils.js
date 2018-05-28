module.exports = {

  /*
    const res = compose(
      fnSecond,
      fnFirst
    )(data)
  */
  compose: (...functions) => data =>
    functions.reduceRight((value, func) => func(value), data),

  /*
    const res = pipe(
      fnFirst
      fnSecond
    )(data)
  */
  pipe: (...functions) => data =>
    functions.reduce((value, func) => func(value), data)

}



