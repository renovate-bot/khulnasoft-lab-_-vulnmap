const { createJestConfig } = require('./test/createJestConfig');

module.exports = createJestConfig({
  displayName: 'vulnmap',
  projects: ['<rootDir>', '<rootDir>/packages/*'],
  globalSetup: './test/setup.js',
});
