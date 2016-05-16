'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * @class Model
 * @augments mongoose.Model
 * @inheritdoc mongoose.Model
 */

var Model = (function () {
  function Model() {
    var schema = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Model);

    this._schema = {};

    this._schema = schema;
    this.options = this.options || {};
  }

  _createClass(Model, [{
    key: 'schema',

    /**
     *
     */

    /**
     * Getter Function for the schema, which allows adding and removing Schema items.
     * @returns {Object}
     */
    get: function () {
      var _this = this;

      return {
        list: function list() {
          return _this._schema;
        },
        add: function add() {
          var schema = arguments[0] === undefined ? {} : arguments[0];
          var overwrite = arguments[1] === undefined ? false : arguments[1];

          _helpers.fixObjectIds(schema);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Object.keys(schema)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var key = _step.value;

              if (!_this._schema[key] || overwrite) {
                _this._schema[key] = schema[key];
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

          return Object.keys(_this._schema);
        },
        remove: function remove() {
          var schema = arguments[0] === undefined ? [] : arguments[0];

          if (_lodash2['default'].isString(schema)) {
            schema = [schema];
          }
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = schema[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var key = _step2.value;

              if (_this._schema[key]) {
                delete _this._schema[key];
              }
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

          return Object.keys(_this._schema);
        }
      };
    },

    /**
     * Sets the schema to whatever is passed in.
     * @param {Object} schema
     */
    set: function (schema) {
      _helpers.fixObjectIds(schema);
      this._schema = schema;
    }
  }, {
    key: 'extend',

    /**
     * Merges other classes extended from Model into an instance of Model.
     * Must call all extensions before generating Schema.
     * @param {object} extension - instance of a class extended from Model
     */
    value: function extend(extension) {
      var _this2 = this;

      // Validate the model and throw an error if they are trying to extend a non Model base class.
      if (!extension instanceof Model) {
        throw new Error('You may only use extend with an instance of a Class extended from Model');
      }

      // Extend the current schema with the schema of the extension, overwriting duplicates
      this.schema.add(extension._schema, true);

      // Pull out the various types of functions from self and extension in order to merge functions
      var extPrototype = extension.constructor.prototype;
      var extStatic = extension.constructor;
      var prototypeKeys = Object.getOwnPropertyNames(extPrototype);
      var staticKeys = Object.getOwnPropertyNames(extStatic);
      var extendedPaths = Object.getOwnPropertyNames(extension);

      extendedPaths.forEach(function (extendedPath) {
        if (extendedPath === '_schema') {
          return;
        }
        _this2[extendedPath] = extension[extendedPath];
      });

      // Add all methods to the prototype
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = prototypeKeys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _name = _step3.value;

          if (_name === 'constructor') {
            continue;
          }
          var method = Object.getOwnPropertyDescriptor(extPrototype, _name);
          if (typeof method.value == 'function') {
            this.constructor.prototype[_name] = method.value;
            continue;
          }

          if (typeof method.get == 'function' || typeof method.set == 'function') {
            var get = method.get || null;
            var set = method.set || null;

            var options = { configurable: true, enumerable: true };

            if (set) {
              options.set = set;
            }
            if (get) {
              options.get = get;
            }
            Object.defineProperty(this.constructor.prototype, _name, options);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      // Add all statics to the class itself.
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = staticKeys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _name2 = _step4.value;

          var method = Object.getOwnPropertyDescriptor(extStatic, _name2);
          if (typeof method.value == 'function') {
            this.constructor[_name2] = method.value;
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if (extension.constructor.hasOwnProperty('plugins')) {
        if (!this.constructor.hasOwnProperty('plugins')) {
          this.constructor.plugins = extension.constructor.plugins;
        } else {
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            var _loop = function () {
              var plugin = _step5.value;

              // noinspection Eslint
              if (_this2.constructor.plugins.find(function (element) {
                return element.fn.name === plugin.fn.name;
              }) === undefined) {
                _this2.constructor.plugins.push(plugin);
              }
            };

            for (var _iterator5 = extension.constructor.plugins[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              _loop();
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                _iterator5['return']();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        }
      }
    }
  }, {
    key: 'buildSchemaObject',
    value: function buildSchemaObject() {
      var _this3 = this;

      var paths = _lodash2['default'].filter(Object.getOwnPropertyNames(this), function (name) {
        return name !== '_schema' && name !== 'options';
      });
      this._schema = this._schema || {};
      paths.forEach(function (path) {
        _this3._schema[path] = _this3[path];
      });
      _helpers.fixObjectIds(this._schema);
    }
  }, {
    key: 'generateSchema',

    /**
     * Generates the mongoose schema for the model.
     */
    value: function generateSchema() {
      this.buildSchemaObject();
      var schema = new _mongoose2['default'].Schema(this._schema, this.options);
      var proto = this.constructor.prototype;
      var self = this.constructor;
      var staticProps = _helpers.getFunctionNamesOrdered(self);
      var prototypeProps = _helpers.getFunctionNamesOrdered(proto);
      var instanceProps = prototypeProps.filter(function (name) {
        return name !== 'constructor';
      });

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = staticProps[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var _name3 = _step6.value;

          var method = Object.getOwnPropertyDescriptor(self, _name3);
          if (typeof method.value == 'function') {
            var prefix = _name3.split('_')[0];
            switch (prefix) {
              case 'pre':
                var pre = method.value();
                schema.pre(pre.action, pre.fn);
                break;
              case 'post':
                var post = method.value();
                schema.post(post.action, post.fn);
                break;
              case 'validator':
                var validator = method.value();
                schema.path(validator.path).validate(validator.fn, validator.message);
                break;
              default:
                schema['static'](_name3, method.value);
            }
          }
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6['return']) {
            _iterator6['return']();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = instanceProps[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _name4 = _step7.value;

          var method = Object.getOwnPropertyDescriptor(proto, _name4);
          if (typeof method.value == 'function') {
            schema.method(_name4, method.value);
          }

          if (method.set || method.get) {
            var virtual = schema.virtual(_name4);

            if (typeof method.set == 'function') {
              virtual.set(method.set);
            }

            if (typeof method.get == 'function') {
              virtual.get(method.get);
            }
          }

          if (method.set && typeof method.set == 'function') {
            schema.virtual(_name4).set(method.set);
          }

          if (method.get && typeof method.get == 'function') {
            schema.virtual(_name4).get(method.get);
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7['return']) {
            _iterator7['return']();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      if (this.constructor.hasOwnProperty('plugins')) {
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = this.constructor.plugins[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var plugin = _step8.value;

            schema.plugin(plugin.fn, plugin.options);
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8['return']) {
              _iterator8['return']();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }
      }

      return schema;
    }
  }, {
    key: 'generateModel',

    /**
     * generates the mongoose model for the Model
     * @returns {Object}
     */
    value: function generateModel() {
      return _mongoose2['default'].model(this.constructor.name, this.generateSchema());
    }
  }], [{
    key: 'generateSchema',
    value: function generateSchema() {
      var model = new this();
      return model.generateSchema();
    }
  }, {
    key: 'generateModel',
    value: function generateModel() {
      for (var _len = arguments.length, extensions = Array(_len), _key = 0; _key < _len; _key++) {
        extensions[_key] = arguments[_key];
      }

      var model = new this();
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = extensions[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var extension = _step9.value;

          model.extend(extension);
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9['return']) {
            _iterator9['return']();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      return model.generateModel();
    }
  }]);

  return Model;
})();

exports['default'] = Model;
module.exports = exports['default'];