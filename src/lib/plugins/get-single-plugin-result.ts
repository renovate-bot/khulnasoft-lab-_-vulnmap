import plugins = require('.');
import { ModuleInfo } from '../module-info';
import { legacyPlugin as pluginApi } from '@khulnasoft/cli-interface';
import { TestOptions, Options, MonitorOptions } from '../types';
import { vulnmapHttpClient } from '../request/vulnmap-http-client';

export async function getSinglePluginResult(
  root: string,
  options: Options & (TestOptions | MonitorOptions),
  targetFile?: string,
): Promise<pluginApi.InspectResult> {
  const plugin = plugins.loadPlugin(options.packageManager);
  const moduleInfo = ModuleInfo(plugin, options.policy);
  const inspectRes: pluginApi.InspectResult = await moduleInfo.inspect(
    root,
    targetFile || options.file,
    { ...options },
    vulnmapHttpClient,
  );
  return inspectRes;
}
