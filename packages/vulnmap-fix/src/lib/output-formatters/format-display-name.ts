import * as pathLib from 'path';
import { Identity } from '../../../cli/packages/vulnmap-fix/src/types';

export function formatDisplayName(
  path: string,
  identity: Pick<Identity, 'type' | 'targetFile'>,
): string {
  if (!identity.targetFile) {
    return `${identity.type} project`;
  }
  // show paths relative to where `vulnmap fix` is running
  return pathLib.relative(
    process.cwd(),
    pathLib.join(path, identity.targetFile),
  );
}
