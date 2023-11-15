/*
  We are collecting Vulnmap CLI usage in our official integrations

  We distinguish them by either:
  - Setting VULNMAP_INTEGRATION_NAME or VULNMAP_INTEGRATION_VERSION in environment when CLI is run
  - passing an --integration-name or --integration-version flags on CLI invocation

  Integration name is validated with a list
*/

import { exec } from 'child_process';
import * as createDebug from 'debug';
import * as fs from 'fs';
import { join } from 'path';
import { ArgsOptions } from '../../../cli/src/cli/args';

const debug = createDebug('vulnmap');

export const INTEGRATION_NAME_ENVVAR = 'VULNMAP_INTEGRATION_NAME';
export const INTEGRATION_VERSION_ENVVAR = 'VULNMAP_INTEGRATION_VERSION';
export const INTEGRATION_ENVIRONMENT_ENVVAR = 'VULNMAP_INTEGRATION_ENVIRONMENT';
export const INTEGRATION_ENVIRONMENT_VERSION_ENVVAR =
  'VULNMAP_INTEGRATION_ENVIRONMENT_VERSION';

enum TrackedIntegration {
  // tracked by passing envvar on CLI invocation
  HOMEBREW = 'HOMEBREW',
  SCOOP = 'SCOOP',

  // Our Docker images - tracked by passing envvar on CLI invocation
  DOCKER_VULNMAP_CLI = 'DOCKER_VULNMAP_CLI', // docker vulnmap/vulnmap-cli
  DOCKER_VULNMAP = 'DOCKER_VULNMAP', // docker vulnmap/vulnmap

  // IDE plugins - tracked by passing flag or envvar on CLI invocation
  JETBRAINS_IDE = 'JETBRAINS_IDE',
  ECLIPSE = 'ECLIPSE',
  VISUAL_STUDIO = 'VISUAL_STUDIO',
  VS_CODE = 'VS_CODE',
  VS_CODE_VULN_COST = 'VS_CODE_VULN_COST',

  // CI - tracked by passing flag or envvar on CLI invocation
  JENKINS = 'JENKINS',
  TEAMCITY = 'TEAMCITY',
  BITBUCKET_PIPELINES = 'BITBUCKET_PIPELINES',
  AZURE_PIPELINES = 'AZURE_PIPELINES',
  CIRCLECI_ORB = 'CIRCLECI_ORB',
  GITHUB_ACTIONS = 'GITHUB_ACTIONS',
  MAVEN_PLUGIN = 'MAVEN_PLUGIN',
  AWS_CODEPIPELINE = 'AWS_CODEPIPELINE',

  // Partner integrations - tracked by passing envvar on CLI invocation
  DOCKER_DESKTOP = 'DOCKER_DESKTOP',

  // DevRel integrations and plugins
  // Netlify plugin: https://github.com/khulnasoft-lab-labs/netlify-plugin-vulnmap
  NETLIFY_PLUGIN = 'NETLIFY_PLUGIN',

  // CLI_V1_PLUGIN integration
  CLI_V1_PLUGIN = 'CLI_V1_PLUGIN',
}

export const getIntegrationName = (args: ArgsOptions[]): string => {
  const maybeHomebrew = isHomebrew() ? 'HOMEBREW' : '';
  const maybeScoop = isScoop() ? 'SCOOP' : '';

  const integrationName = (
    (args[0]?.integrationName as string) || // Integration details passed through CLI flag
    process.env[INTEGRATION_NAME_ENVVAR] ||
    maybeHomebrew ||
    maybeScoop ||
    ''
  ).toUpperCase();
  if (integrationName in TrackedIntegration) {
    return integrationName;
  }

  return '';
};

export const getIntegrationVersion = (args: ArgsOptions[]): string =>
  (args[0]?.integrationVersion as string) ||
  process.env[INTEGRATION_VERSION_ENVVAR] ||
  '';

export const getIntegrationEnvironment = (args: ArgsOptions[]): string =>
  (args[0]?.integrationEnvironment as string) ||
  process.env[INTEGRATION_ENVIRONMENT_ENVVAR] ||
  '';

export const getIntegrationEnvironmentVersion = (args: ArgsOptions[]): string =>
  (args[0]?.integrationEnvironmentVersion as string) ||
  process.env[INTEGRATION_ENVIRONMENT_VERSION_ENVVAR] ||
  '';

export function isScoop(): boolean {
  const currentProcessPath = process.execPath;
  const looksLikeScoop =
    currentProcessPath.includes('vulnmap-win.exe') &&
    currentProcessPath.includes('scoop');

  if (looksLikeScoop) {
    return validateScoopManifestFile(currentProcessPath);
  } else {
    return false;
  }
}

export function validateScoopManifestFile(
  vulnmapExecutablePath: string,
): boolean {
  // If this really is installed with scoop, there should be a `manifest.json` file adjacent to the running CLI executable (`vulnmap-win.exe`) which
  // we can look at for further validation that this really is from scoop.
  try {
    const vulnmapScoopManifiestPath = vulnmapExecutablePath.replace(
      'vulnmap-win.exe',
      'manifest.json',
    );
    if (fs.existsSync(vulnmapScoopManifiestPath)) {
      const manifestJson = JSON.parse(
        fs.readFileSync(vulnmapScoopManifiestPath, 'utf8'),
      );

      const url = manifestJson.url;
      if (
        url.startsWith('https://github.com/khulnasoft-lab/vulnmap') &&
        url.endsWith('vulnmap-win.exe')
      ) {
        return true;
      }
    }
  } catch (error) {
    debug('Error validating scoop manifest file', error);
  }
  return false;
}

export function isHomebrew(): boolean {
  const currentProcessPath = process.execPath;
  const isHomebrewPath = currentProcessPath.includes('/Cellar/vulnmap/');
  if (isHomebrewPath) {
    return validateHomebrew(currentProcessPath);
  } else {
    return false;
  }
}

export function validateHomebrew(vulnmapExecutablePath: string): boolean {
  try {
    const expectedFormulaFilePath = join(
      vulnmapExecutablePath,
      '../../.brew/vulnmap.rb',
    );
    const formulaFileExists = fs.existsSync(expectedFormulaFilePath);
    return formulaFileExists;
  } catch (error) {
    debug('Error checking for Homebrew Formula file', error);
  }
  return false;
}

function runCommand(cmd: string): Promise<string> {
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        debug("Error trying to get program's version", error);
      }
      return resolve(stdout ? stdout : stderr);
    });
  });
}

export async function isInstalled(commandToCheck: string): Promise<boolean> {
  let whichCommand = 'which';
  const os = process.platform;
  if (os === 'win32') {
    whichCommand = 'where';
  } else if (os === 'android') {
    whichCommand = 'adb shell which';
  }

  try {
    await runCommand(`${whichCommand} ${commandToCheck}`);
  } catch (error) {
    return false;
  }
  return true;
}
