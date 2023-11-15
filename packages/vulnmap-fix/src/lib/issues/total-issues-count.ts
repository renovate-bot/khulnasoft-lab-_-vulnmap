import { IssuesData } from '../../../cli/packages/vulnmap-fix/src/types';

export function getTotalIssueCount(issueData: IssuesData[]): number {
  let total = 0;

  for (const entry of issueData) {
    total += Object.keys(entry).length;
  }

  return total;
}
