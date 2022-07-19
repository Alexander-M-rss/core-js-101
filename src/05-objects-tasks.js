/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  const res = {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };

  res.width = width;
  res.height = height;

  return res;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return new proto.constructor(...Object.values(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CssSelectorChain {
  constructor() {
    this.selectors = [];
    this.previosOrder = 0;
    this.notRepeatable = new Set(null);
  }

  static throwMoreThenOneError() {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  static throwOrderError() {
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }

  element(value) {
    if (this.order === 1) CssSelectorChain.throwMoreThenOneError();
    else if (this.order > 1) CssSelectorChain.throwOrderError();

    this.selectors.push(value);
    this.order = 1;
    return this;
  }

  id(value) {
    if (this.order === 2) CssSelectorChain.throwMoreThenOneError();
    else if (this.order > 2) CssSelectorChain.throwOrderError();

    this.selectors.push(`#${value}`);
    this.order = 2;
    return this;
  }

  class(value) {
    if (this.order > 3) CssSelectorChain.throwOrderError();

    this.selectors.push(`.${value}`);
    this.order = 3;
    return this;
  }

  attr(value) {
    if (this.order > 4) CssSelectorChain.throwOrderError();

    this.selectors.push(`[${value}]`);
    this.order = 4;
    return this;
  }

  pseudoClass(value) {
    if (this.order > 5) CssSelectorChain.throwOrderError();

    this.selectors.push(`:${value}`);
    this.order = 5;
    return this;
  }

  pseudoElement(value) {
    if (this.order === 6) CssSelectorChain.throwMoreThenOneError();

    this.selectors.push(`::${value}`);
    this.order = 6;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selectors = selector1.selectors.concat(` ${combinator} `).concat(selector2.selectors);
    return this;
  }

  stringify() {
    const chain = this.selectors.join('');

    this.selectors = [];
    this.order = 0;

    return chain;
  }
}


const cssSelectorBuilder = {
  element(value) {
    const chain = new CssSelectorChain();
    return chain.element(value);
  },

  id(value) {
    const chain = new CssSelectorChain();
    return chain.id(value);
  },

  class(value) {
    const chain = new CssSelectorChain();
    return chain.class(value);
  },

  attr(value) {
    const chain = new CssSelectorChain();
    return chain.attr(value);
  },

  pseudoClass(value) {
    const chain = new CssSelectorChain();
    return chain.pseudoClass(value);
  },

  pseudoElement(value) {
    const chain = new CssSelectorChain();
    return chain.pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    const chain = new CssSelectorChain();
    return chain.combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
