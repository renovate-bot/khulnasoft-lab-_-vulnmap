const { getCliBinaryPath } = require('./jest/util/getCliBinaryPath');
const {
  isDontSkipTestsEnabled,
} = require('./jest/util/isDontSkipTestsEnabled');
const {
  fipsTestsEnabled,
  getFipsEnabledEnvironment,
} = require('./jest/util/fipsTestHelper');
const { runVulnmapCLI } = require('./jest/util/runVulnmapCLI');

module.exports = async function() {
  if (process.env.TEST_VULNMAP_COMMAND) {
    process.env.TEST_VULNMAP_COMMAND = getCliBinaryPath();
  }

  let token = 'UNSET';
  if (process.env.TEST_VULNMAP_TOKEN !== undefined) {
    token = '***';
  }

  console.info(
    '\n------------------------------------------------------------------------------------------------------' +
      '\n Binary under test   [TEST_VULNMAP_COMMAND] .............. ' +
      process.env.TEST_VULNMAP_COMMAND +
      '\n Allow to skip tests [TEST_VULNMAP_DONT_SKIP_ANYTHING] ... ' +
      !isDontSkipTestsEnabled() +
      '\n Run FIPS tests      [TEST_VULNMAP_FIPS] ................. ' +
      fipsTestsEnabled() +
      '\n Organization        [TEST_VULNMAP_ORG_SLUGNAME] ......... ' +
      process.env.TEST_VULNMAP_ORG_SLUGNAME +
      '\n Token               [TEST_VULNMAP_TOKEN] ................ ' +
      token +
      '\n------------------------------------------------------------------------------------------------------',
  );

  if (
    process.env.VULNMAP_API_KEY ||
    process.env.VULNMAP_TOKEN ||
    process.env.TEST_VULNMAP_TOKEN === undefined
  ) {
    delete process.env.VULNMAP_TOKEN;
    delete process.env.VULNMAP_API_KEY;
    console.error(
      '\n------------------------------------------------------------' +
        '\n Currently Tests require the environment variable TEST_VULNMAP_TOKEN to be set.' +
        '\n This token is automatically stored on the config as some tests require this.' +
        '\n------------------------------------------------------------',
    );
  }

  if (fipsTestsEnabled()) {
    process.env = getFipsEnabledEnvironment();
  }

  if (process.env.TEST_VULNMAP_TOKEN !== undefined) {
    await runVulnmapCLI(`config set api=${process.env.TEST_VULNMAP_TOKEN}`);
  }

  console.error(
    '\n------------------------------------------------------------' +
      '\n Environment successfully setup! Starting to run tests now!' +
      '\n------------------------------------------------------------',
  );
};
