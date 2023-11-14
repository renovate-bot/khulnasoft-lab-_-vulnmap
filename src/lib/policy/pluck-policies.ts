const flatten = require('lodash.flatten');
import { PackageExpanded } from 'vulnmap-resolve-deps';

export function pluckPolicies(pkg: PackageExpanded): string[] | string {
  if (!pkg) {
    return [];
  }

  if (pkg.vulnmap) {
    return pkg.vulnmap;
  }

  if (!pkg.dependencies) {
    return [];
  }

  return flatten(
    Object.keys(pkg.dependencies)
      .map((name: string) => pluckPolicies(pkg.dependencies[name]))
      .filter(Boolean),
  );
}
