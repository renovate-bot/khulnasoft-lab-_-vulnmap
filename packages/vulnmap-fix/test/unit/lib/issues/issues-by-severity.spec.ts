import { getIssueCountBySeverity } from '../../../../src/lib/issues/issues-by-severity';
import { IssuesData, SEVERITY } from '../../../../src/types';

describe('getIssueCountBySeverity', () => {
  it('correctly returns when no issues', () => {
    const issueData = [];
    const res = getIssueCountBySeverity(issueData);
    expect(res).toEqual({
      critical: [],
      high: [],
      low: [],
      medium: [],
    });
  });

  it('correctly returns when all severities are present', () => {
    const issueData: IssuesData[] = [
      {
        'VULNMAP-1': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'VULNMAP-1',
        },
      },
      {
        'VULNMAP-2': {
          title: 'High severity issue',
          severity: SEVERITY.HIGH,
          id: 'VULNMAP-2',
        },
      },
      {
        'VULNMAP-3': {
          title: 'High severity issue',
          severity: SEVERITY.MEDIUM,
          id: 'VULNMAP-3',
        },
      },
      {
        'VULNMAP-4': {
          title: 'High severity issue',
          severity: SEVERITY.LOW,
          id: 'VULNMAP-4',
        },
      },
    ];
    const res = getIssueCountBySeverity(issueData);
    expect(res).toEqual({
      critical: ['VULNMAP-1'],
      high: ['VULNMAP-2'],
      low: ['VULNMAP-4'],
      medium: ['VULNMAP-3'],
    });
  });

  it('correctly returns when some severities are present', () => {
    const issueData: IssuesData[] = [
      {
        'VULNMAP-1': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'VULNMAP-1',
        },
      },
      {
        'VULNMAP-2': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'VULNMAP-2',
        },
      },
      {
        'VULNMAP-3': {
          title: 'Critical severity issue',
          severity: SEVERITY.CRITICAL,
          id: 'VULNMAP-3',
        },
      },
      {
        'VULNMAP-4': {
          title: 'High severity issue',
          severity: SEVERITY.MEDIUM,
          id: 'VULNMAP-4',
        },
      },
      {
        'VULNMAP-5': {
          title: 'High severity issue',
          severity: SEVERITY.MEDIUM,
          id: 'VULNMAP-5',
        },
      },
    ];
    const res = getIssueCountBySeverity(issueData);
    expect(res).toEqual({
      critical: ['VULNMAP-1', 'VULNMAP-2', 'VULNMAP-3'],
      high: [],
      low: [],
      medium: ['VULNMAP-4', 'VULNMAP-5'],
    });
  });
});
