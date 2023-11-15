import chalk from 'chalk';

import { isLocalFolder } from '../detect';
import { TestResult } from '../vulnmap-test/legacy';
import { Options, SupportedProjectTypes, TestOptions } from '../types';

export function showFixTip(
  projectType: SupportedProjectTypes,
  res: TestResult,
  options: TestOptions & Options,
): string {
  const vulnmapFixSupported: SupportedProjectTypes[] = ['pip', 'poetry'];
  if (
    !vulnmapFixSupported.includes(projectType) ||
    !isLocalFolder(options.path)
  ) {
    return '';
  }

  if (!res.ok && res.vulnerabilities.length > 0) {
    return (
      `Tip: Try ${chalk.bold(
        '`vulnmap fix`',
      )} to address these issues.${chalk.bold(
        '`vulnmap fix`',
      )} is a new CLI command in that aims to automatically apply the recommended updates for supported ecosystems.` +
      '\nSee documentation on how to enable this beta feature: https://docs.vulnmap.khulnasoft.com/vulnmap-cli/fix-vulnerabilities-from-the-cli/automatic-remediation-with-vulnmap-fix#enabling-vulnmap-fix'
    );
  }

  return '';
}
