import protect from '../../../../cli/packages/vulnmap-protect/src/lib';
import {
  getVersion,
  getHelp,
} from '../../../../cli/packages/vulnmap-protect/src/lib';
import { createProject } from '../../../../cli/packages/vulnmap-protect/test/util/createProject';
import { getPatchedLodash } from '../../../../cli/packages/vulnmap-protect/test/util/getPatchedLodash';
import { runCommand } from '../../../../cli/packages/vulnmap-protect/test/util/runCommand';
import * as http from '../../../../cli/packages/vulnmap-protect/src/lib/http';
import * as analytics from '../../../../cli/packages/vulnmap-protect/src/lib/analytics';
import * as path from 'path';
import * as os from 'os';
import * as fse from 'fs-extra';

jest.setTimeout(1000 * 60);

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('@khulnasoft/protect', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('applies patch(es)', () => {
    it('works for project with a single patchable module', async () => {
      const log = jest.spyOn(global.console, 'log');
      const postJsonSpy = jest.spyOn(http, 'postJson');
      const project = await createProject('single-patchable-module');
      const patchedLodash = await getPatchedLodash();

      await protect(project.path());

      await expect(
        project.read('node_modules/nyc/node_modules/lodash/lodash.js'),
      ).resolves.toEqual(patchedLodash);

      expect(
        fse.existsSync(
          project.path(
            `node_modules/nyc/node_modules/lodash/lodash.js.vulnmap-protect.flag`,
          ),
        ),
      ).toBe(true);

      expect(
        fse.existsSync(
          project.path(
            `node_modules/nyc/node_modules/lodash/.vulnmap-VULNMAP-JS-LODASH-567746.flag`,
          ),
        ),
      ).toBe(true);

      expect(log).toHaveBeenCalledWith('Applied Vulnmap patches.');
      expect(postJsonSpy).toHaveBeenCalledTimes(1);
      expect(postJsonSpy.mock.calls[0][1]).toEqual({
        data: {
          command: '@khulnasoft/protect',
          args: [],
          version: '1.0.0-monorepo',
          nodeVersion: process.version,
          metadata: {
            protectResult: {
              type: 'APPLIED_PATCHES',
              patchedModules: [
                {
                  vulnId: 'VULNMAP-JS-LODASH-567746',
                  packageName: 'lodash',
                  packageVersion: '4.17.15',
                },
              ],
            },
          },
        },
      });
    });

    it('works for project with multiple patchable modules', async () => {
      const log = jest.spyOn(global.console, 'log');
      const postJsonSpy = jest.spyOn(http, 'postJson');
      const project = await createProject('multiple-matching-paths');
      const patchedLodash = await getPatchedLodash();

      await protect(project.path());

      await expect(
        project.read('node_modules/nyc/node_modules/lodash/lodash.js'),
      ).resolves.toEqual(patchedLodash);
      await expect(
        project.read('node_modules/lodash/lodash.js'),
      ).resolves.toEqual(patchedLodash);

      expect(
        fse.existsSync(
          project.path(
            `node_modules/nyc/node_modules/lodash/lodash.js.vulnmap-protect.flag`,
          ),
        ),
      ).toBe(true);

      expect(
        fse.existsSync(
          project.path(`node_modules/lodash/lodash.js.vulnmap-protect.flag`),
        ),
      ).toBe(true);

      expect(
        fse.existsSync(
          project.path(
            `node_modules/nyc/node_modules/lodash/.vulnmap-VULNMAP-JS-LODASH-567746.flag`,
          ),
        ),
      ).toBe(true);
      expect(
        fse.existsSync(
          project.path(
            `node_modules/lodash/.vulnmap-VULNMAP-JS-LODASH-567746.flag`,
          ),
        ),
      ).toBe(true);

      expect(log).toHaveBeenCalledWith('Applied Vulnmap patches.');
      expect(postJsonSpy).toHaveBeenCalledTimes(1);
      expect(postJsonSpy.mock.calls[0][1]).toEqual({
        data: {
          command: '@khulnasoft/protect',
          args: [],
          version: '1.0.0-monorepo',
          nodeVersion: process.version,
          metadata: {
            protectResult: {
              type: 'APPLIED_PATCHES',
              patchedModules: [
                {
                  vulnId: 'VULNMAP-JS-LODASH-567746',
                  packageName: 'lodash',
                  packageVersion: '4.17.15',
                },
                {
                  vulnId: 'VULNMAP-JS-LODASH-567746',
                  packageName: 'lodash',
                  packageVersion: '4.17.15',
                },
              ],
            },
          },
        },
      });
    });

    it('works when the vulnId in a .vulnmap file is quoted', async () => {
      const log = jest.spyOn(global.console, 'log');
      const postJsonSpy = jest.spyOn(http, 'postJson');
      const project = await createProject(
        'single-patchable-module-with-quotes',
      );
      const patchedLodash = await getPatchedLodash();

      await protect(project.path());

      await expect(
        project.read('node_modules/nyc/node_modules/lodash/lodash.js'),
      ).resolves.toEqual(patchedLodash);

      expect(
        fse.existsSync(
          project.path(
            `node_modules/nyc/node_modules/lodash/lodash.js.vulnmap-protect.flag`,
          ),
        ),
      ).toBe(true);

      expect(
        fse.existsSync(
          project.path(
            `node_modules/nyc/node_modules/lodash/.vulnmap-VULNMAP-JS-LODASH-567746.flag`,
          ),
        ),
      ).toBe(true);

      expect(log).toHaveBeenCalledWith('Applied Vulnmap patches.');
      expect(postJsonSpy).toHaveBeenCalledTimes(1);
      expect(postJsonSpy.mock.calls[0][1]).toEqual({
        data: {
          command: '@khulnasoft/protect',
          args: [],
          version: '1.0.0-monorepo',
          nodeVersion: process.version,
          metadata: {
            protectResult: {
              type: 'APPLIED_PATCHES',
              patchedModules: [
                {
                  vulnId: 'VULNMAP-JS-LODASH-567746',
                  packageName: 'lodash',
                  packageVersion: '4.17.15',
                },
              ],
            },
          },
        },
      });
    });
  });

  describe('does not apply any patches and does not fail', () => {
    // in this scenario .vulnmap file has a vulnId which corresponds to the `lodash` package, but there are not instances of lodash in the node_modules
    it('for project with no modules with the target package name', async () => {
      const postJsonSpy = jest.spyOn(http, 'postJson');
      const project = await createProject('no-matching-paths');
      const log = jest.spyOn(global.console, 'log');

      await protect(project.path());

      expect(log).toHaveBeenCalledWith('Nothing to patch.');

      expect(postJsonSpy).toHaveBeenCalledTimes(1);
      expect(postJsonSpy.mock.calls[0][1]).toEqual({
        data: {
          command: '@khulnasoft/protect',
          args: [],
          version: '1.0.0-monorepo',
          nodeVersion: process.version,
          metadata: {
            protectResult: {
              type: 'NOTHING_TO_PATCH',
            },
          },
        },
      });
    });

    // skipped because we need to check the versions of the found modules before we attempt to patch them which we don't currently do
    // and in order to do that, we need to first switch over to the new endpoint
    // it('for a project that has an instance of the target module but we have no patches for its version', async () => {
    //   const project = await createProject('target-module-exists-but-no-patches-for-version');
    //   const log = jest.spyOn(global.console, 'log');
    //   await protect(project.path());
    //   expect(log).toHaveBeenCalledWith('Nothing to patch');
    // });

    // fixture has a lodash@4.14.1 which we don't have patches for
    it('for project with no .vulnmap file', async () => {
      const postJsonSpy = jest.spyOn(http, 'postJson');
      const project = await createProject('no-vulnmap-file');
      const log = jest.spyOn(global.console, 'log');

      await protect(project.path());

      expect(log).toHaveBeenCalledWith('No .vulnmap file found.');

      expect(postJsonSpy).toHaveBeenCalledTimes(1);
      expect(postJsonSpy.mock.calls[0][1]).toEqual({
        data: {
          command: '@khulnasoft/protect',
          args: [],
          version: '1.0.0-monorepo',
          nodeVersion: process.version,
          metadata: {
            protectResult: {
              type: 'NO_VULNMAP_FILE',
            },
          },
        },
      });
    });
  });

  describe('does not send analytics if analytics is disabled', () => {
    describe('via vulnmap.json file', () => {
      let tempConfigFolder: string;
      let tempVulnmapConfigFile: string;

      beforeAll(() => {
        tempConfigFolder = fse.mkdtempSync(
          path.resolve(os.tmpdir(), `vulnmap-config-`),
        );
        tempVulnmapConfigFile = path.resolve(tempConfigFolder, 'vulnmap.json');
        process.env.VULNMAP_CONFIG_FILE = tempVulnmapConfigFile;
      });

      afterAll(() => {
        delete process.env.VULNMAP_CONFIG_FILE;
        fse.removeSync(tempConfigFolder);
      });

      it('when disable-analytics equals "1" (as a string)', async () => {
        fse.writeFileSync(
          tempVulnmapConfigFile,
          JSON.stringify({ 'disable-analytics': '1' }),
          'utf-8',
        );
        const postJsonSpy = jest.spyOn(http, 'postJson');
        const sendAnalyticsSpy = jest.spyOn(analytics, 'sendAnalytics');
        const project = await createProject('no-matching-paths');
        await protect(project.path());
        expect(sendAnalyticsSpy).toHaveBeenCalledTimes(1); // we call sendAnalytics
        expect(postJsonSpy).toHaveBeenCalledTimes(0); // but a call to the API was never made
      });

      it('when disable-analytics equals 1 (as a number)', async () => {
        fse.writeFileSync(
          tempVulnmapConfigFile,
          JSON.stringify({ 'disable-analytics': 1 }),
          'utf-8',
        );
        const postJsonSpy = jest.spyOn(http, 'postJson');
        const sendAnalyticsSpy = jest.spyOn(analytics, 'sendAnalytics');
        const project = await createProject('no-matching-paths');
        await protect(project.path());
        expect(sendAnalyticsSpy).toHaveBeenCalledTimes(1); // we call sendAnalytics
        expect(postJsonSpy).toHaveBeenCalledTimes(0); // but a call to the API was never made
      });
    });

    describe('via VULNMAP_DISABLE_ANALYTICS env var', () => {
      it('when VULNMAP_DISABLE_ANALYTICS is "true"', async () => {
        process.env.VULNMAP_DISABLE_ANALYTICS = 'true';
        try {
          const postJsonSpy = jest.spyOn(http, 'postJson');
          const sendAnalyticsSpy = jest.spyOn(analytics, 'sendAnalytics');
          const project = await createProject('no-matching-paths');
          await protect(project.path());
          expect(sendAnalyticsSpy).toHaveBeenCalledTimes(1); // we call sendAnalytics
          expect(postJsonSpy).toHaveBeenCalledTimes(0); // but a call to the API was never made
        } finally {
          delete process.env.VULNMAP_DISABLE_ANALYTICS;
          console.log(delete process.env.VULNMAP_DISABLE_ANALYTICS);
        }
      });

      it('when VULNMAP_DISABLE_ANALYTICS is "1"', async () => {
        process.env.VULNMAP_DISABLE_ANALYTICS = '1';
        try {
          const postJsonSpy = jest.spyOn(http, 'postJson');
          const sendAnalyticsSpy = jest.spyOn(analytics, 'sendAnalytics');
          const project = await createProject('no-matching-paths');
          await protect(project.path());
          expect(sendAnalyticsSpy).toHaveBeenCalledTimes(1); // we call sendAnalytics
          expect(postJsonSpy).toHaveBeenCalledTimes(0); // but a call to the API was never made
        } finally {
          delete process.env.VULNMAP_DISABLE_ANALYTICS;
          console.log(delete process.env.VULNMAP_DISABLE_ANALYTICS);
        }
      });
    });
  });

  describe('outputs correct help documentation', () => {
    it('when called with --help', async () => {
      const project = await createProject('help-flag');

      const { code, stdout } = await runCommand(
        'node',
        [path.resolve(__dirname, '../../bin/vulnmap-protect'), '--help'],
        {
          cwd: project.path(),
        },
      );

      expect(stdout).toMatch(getHelp());
      expect(code).toEqual(0);
    });
  });

  describe('outputs correct version', () => {
    it('when called with --version', async () => {
      const project = await createProject('version-flag');

      const { code, stdout } = await runCommand(
        'node',
        [path.resolve(__dirname, '../../bin/vulnmap-protect'), '--version'],
        {
          cwd: project.path(),
        },
      );

      expect(stdout).toMatch(getVersion());
      expect(code).toEqual(0);
    });
  });

  describe('does not attempt to apply patch if a flag file exists indicating the file has already been patched', () => {
    it('with `.orig` file from the old protect', async () => {
      const pathToProtectBin = path.resolve(
        __dirname,
        '../../bin/vulnmap-protect',
      );
      const project = await createProject(
        'single-patchable-module-patched-with-old-protect',
      );
      // sleep 2 ms to guarentee that before/after modified times cannot be the
      // same because the file was written and then modified within a single millisecond.
      await sleep(2);

      const lodashPath = project.path(
        'node_modules/nyc/node_modules/lodash/lodash.js',
      );
      const lodashStatInital = await fse.promises.stat(lodashPath);

      const { code, stdout } = await runCommand('node', [pathToProtectBin], {
        cwd: project.path(),
      });

      expect(code).toBe(0);
      expect(stdout).toContain('Applied Vulnmap patches.');

      const lodashStatAfter = await fse.promises.stat(lodashPath);
      expect(lodashStatAfter.mtimeMs).toBe(lodashStatInital.mtimeMs); // file not touched
    });

    it('with `.vulnmap-protect.flag` file from the new protect', async () => {
      const pathToProtectBin = path.resolve(
        __dirname,
        '../../bin/vulnmap-protect',
      );
      const project = await createProject(
        'single-patchable-module-patched-with-new-protect',
      );
      // sleep 2 ms to guarentee that before/after modified times cannot be the
      // same because the file was written and then modified within a single millisecond.
      await sleep(2);

      const lodashPath = project.path(
        'node_modules/nyc/node_modules/lodash/lodash.js',
      );
      const lodashStatInital = await fse.promises.stat(lodashPath);

      const { code, stdout } = await runCommand('node', [pathToProtectBin], {
        cwd: project.path(),
      });

      expect(code).toBe(0);
      expect(stdout).toContain('Applied Vulnmap patches.');

      const lodashStatAfter = await fse.promises.stat(lodashPath);
      expect(lodashStatAfter.mtimeMs).toBe(lodashStatInital.mtimeMs); // file not touched
    });
  });
});
