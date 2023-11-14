const vulnmapConfig = require('./config');

// This module is kind of "world object" that is used to indirectly import modules.
// This also introduces some circular imports.

// TODO(kyegupov): untangle this, resolve circular imports, convert to Typescript

const vulnmap = {};
module.exports = vulnmap;

vulnmap.id = vulnmapConfig.id;

const apiToken = require('./api-token');

// make vulnmap.api *always* get the latest api token from the config store
Object.defineProperty(vulnmap, 'api', {
  enumerable: true,
  configurable: true,
  get: function() {
    return apiToken.api();
  },
  set: function(value) {
    vulnmapConfig.api = value;
  },
});

vulnmap.test = require('./vulnmap-test');
vulnmap.policy = require('vulnmap-policy');

// this is the user config, and not the internal config
vulnmap.config = require('./user-config').config;
