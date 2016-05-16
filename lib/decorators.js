"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @Wrapper Function that mutates the function.
 * Mutated function named validator_{original function name}
 * Returns a object containing necessary keys to register a validator.
 * @param {String} path - the schema path to validate
 * @param {String} message - the message to return if validation fails
 * @returns {Function}
 */
exports.validation = validation;

/**
 * @Wrapper function that mutates the function
 * Mutated function named pre_{original function name}
 * returns a object containing necessary keys to register a pre hook
 * @param {String} action - The action to hook into
 * @param {Number} priority - integer value representing priority in callQueue. Higher values => first, lower => last
 * @returns {Function}
 */
exports.pre = pre;

/**
 * @Wrapper function that mutates the function
 * Mutated function named post_{original function name}
 * returns a object containing necessary keys to register a post hook
 * @param {String} action - The action to hook into
 * @param {Number} priority - integer value representing priority in callQueue. Higher values => first, lower => last
 * @returns {Function}
 */
exports.post = post;

/**
 * @Wrapper function for classes to add plugins
 * creates a plugins array to the class that is used in schema generation
 * returns a object containing necessary keys to register a plugin on the schema
 * @param {Function} pluginFunction - The plugin function
 * @param {Object} options - The plugin options
 * @returns {Function}
 */
exports.plugin = plugin;

function validation(path, message) {
  return function (target, key, descriptor) {
    var fn = descriptor.value;
    key = "validator_" + key;
    target[key] = function () {
      return { path: path, fn: fn, message: message };
    };
    delete descriptor.value;
    delete descriptor.writeable;
  };
}

function pre(action) {
  var priority = arguments[1] === undefined ? 10 : arguments[1];

  return function (target, key, descriptor) {
    var fn = descriptor.value;
    key = "pre_" + priority + "_" + key;
    target[key] = function () {
      return { fn: fn, action: action };
    };
    delete descriptor.value;
    delete descriptor.writeable;
  };
}

function post(action) {
  var priority = arguments[1] === undefined ? 10 : arguments[1];

  return function (target, key, descriptor) {
    var fn = descriptor.value;
    key = "post_" + priority + "_" + key;
    target[key] = function () {
      return { fn: fn, action: action };
    };
    delete descriptor.value;
    delete descriptor.writeable;
  };
}

function plugin(pluginFunction) {
  var options = arguments[1] === undefined ? {} : arguments[1];

  return function (target) {
    target.plugins = target.plugins || [];
    target.plugins.push({ fn: pluginFunction, options: options });
  };
}