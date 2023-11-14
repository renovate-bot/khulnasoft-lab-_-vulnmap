import { SEVERITIES, SEVERITY } from '../vulnmap-test/common';

export function getSeverityValue(severity: SEVERITY | 'none'): number {
  return SEVERITIES.find((s) => s.verboseName === severity)!.value;
}
