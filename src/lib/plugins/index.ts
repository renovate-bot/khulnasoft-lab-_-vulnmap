import * as rubygemsPlugin from './rubygems';
import * as mvnPlugin from 'vulnmap-mvn-plugin';
import * as gradlePlugin from 'vulnmap-gradle-plugin';
import * as sbtPlugin from 'vulnmap-sbt-plugin';
import * as pythonPlugin from 'vulnmap-python-plugin';
import * as goPlugin from 'vulnmap-go-plugin';
import * as nugetPlugin from 'vulnmap-nuget-plugin';
import * as phpPlugin from 'vulnmap-php-plugin';
import * as nodejsPlugin from './nodejs-plugin';
import * as cocoapodsPlugin from '@khulnasoft/vulnmap-cocoapods-plugin';
import * as hexPlugin from '@khulnasoft/vulnmap-hex-plugin';
import * as swiftPlugin from 'vulnmap-swiftpm-plugin';
import * as types from './types';
import { SupportedPackageManagers } from '../package-managers';
import { UnsupportedPackageManagerError } from '../errors';

export function loadPlugin(
  packageManager: SupportedPackageManagers | undefined,
): types.Plugin {
  switch (packageManager) {
    case 'npm': {
      return nodejsPlugin;
    }
    case 'rubygems': {
      return rubygemsPlugin;
    }
    case 'maven': {
      return mvnPlugin;
    }
    case 'gradle': {
      return gradlePlugin;
    }
    case 'sbt': {
      return sbtPlugin;
    }
    case 'yarn': {
      return nodejsPlugin;
    }
    case 'pip':
    case 'poetry': {
      return pythonPlugin;
    }
    case 'golangdep':
    case 'gomodules':
    case 'govendor': {
      return goPlugin;
    }
    case 'nuget': {
      return nugetPlugin;
    }
    case 'paket': {
      return nugetPlugin;
    }
    case 'composer': {
      return phpPlugin;
    }
    case 'cocoapods': {
      return cocoapodsPlugin;
    }
    case 'hex': {
      return hexPlugin;
    }
    case 'swift': {
      return swiftPlugin;
    }
    default: {
      throw new UnsupportedPackageManagerError(packageManager);
    }
  }
}
