import {
  formatPolicyEngineFileName,
  getChecksum,
  policyEngineVersion,
} from './utils';

/**
 * The Policy Engine release version associated with this Vulnmap CLI version.
 */
export const policyEngineReleaseVersion = policyEngineVersion;

/**
 * The Policy Engine executable's file name.
 */
export const policyEngineFileName = formatPolicyEngineFileName(
  policyEngineReleaseVersion,
);

export const policyEngineChecksum = getChecksum(policyEngineFileName);
