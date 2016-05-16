'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

/**
 * Shortcut to getOwnPropertyDescriptor for two possible objects
 * @param {string} name - The name of the Descriptor to search for
 * @param {object} dest - Destination Object
 * @param {object} source - Source Object
 * @returns {Object|null}
 */
exports.getMethod = getMethod;

/**
 * Shortcut function to return an object containing the prototype of both the primary object and extension,
 * plus the extension constructor.
 * @param {Object} primary - The parent object.
 * @param {Object} extension - The object whose properties are being subsumed.
 * @returns {{prototype: (Object), extPrototype: (Object|Function), extStatic: (Object|Function)}}
 */
exports.getClassParts = getClassParts;

/**
 * Shortcut function get an array of all function names in dest and source.
 * @param {object} dest - Destination object
 * @param {object} source - Source Object
 * @returns {Array}
 */
exports.getFunctionNames = getFunctionNames;
exports.getFunctionNamesOrdered = getFunctionNamesOrdered;

/**
 * Helper method that replaced the string "ObjectId" in schemas with the mongoose.Schema.Types.ObjectId object
 * @param {Object} schema - The schema object
 */
exports.fixObjectIds = fixObjectIds;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function rankIterator(name) {
  var order = {
    validator: 0,
    pre: 1,
    post: 2
  };
  var pieces = name.split('_');
  return order[pieces[0]];
}
function getMethod(name, dest, source) {
  return Object.getOwnPropertyDescriptor(dest, name) || Object.getOwnPropertyDescriptor(source, name);
}

function getClassParts(primary, extension) {
  return {
    prototype: primary.__proto__,
    extPrototype: extension.constructor.prototype,
    extStatic: extension.constructor
  };
}

function getFunctionNames(dest, source) {
  return _lodash2['default'].union(Object.getOwnPropertyNames(source), Object.getOwnPropertyNames(dest));
}

function getFunctionNamesOrdered(object) {
  var names = Object.getOwnPropertyNames(object);
  var avoid = [];

  var specials = _lodash2['default'].filter(names, function (n) {
    return /pre_|post_|validator_/.test(n);
  });
  specials = _lodash2['default'].sortByOrder(specials, [rankIterator, function (n) {
    var priority = 10;
    var pieces = n.split('_');
    pieces.shift();

    if (pieces.length > 1 && !isNaN(pieces[0])) {
      priority = Number(pieces.shift());
    }

    var fnName = pieces.join('_');

    avoid.push(fnName);

    return priority;
  }], [true, false]);

  names = _lodash2['default'].filter(names, function (n) {
    return specials.indexOf(n) === -1 && avoid.indexOf(n) === -1;
  });

  return _lodash2['default'].union(names, specials);
}

function fixObjectIds(schema) {
  var keys = Object.keys(schema);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      if (_lodash2['default'].isString(schema[key]) && schema[key].toLowerCase() === 'objectid') {
        schema[key] = _mongoose.Schema.Types.ObjectId;
      } else if (_lodash2['default'].isString(schema[key].type) && schema[key].type.toLowerCase() === 'objectid') {
        schema[key].type = _mongoose.Schema.Types.ObjectId;
      } else if (_lodash2['default'].isArray(schema[key])) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = schema[key][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var subSchema = _step2.value;

            fixObjectIds(subSchema);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}