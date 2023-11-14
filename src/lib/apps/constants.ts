import chalk from 'chalk';

export const VULNMAP_APP_NAME = 'vulnmapAppName';
export const VULNMAP_APP_REDIRECT_URIS = 'vulnmapAppRedirectUris';
export const VULNMAP_APP_SCOPES = 'vulnmapAppScopes';
export const VULNMAP_APP_CLIENT_ID = 'vulnmapAppClientId';
export const VULNMAP_APP_ORG_ID = 'vulnmapAppOrgId';
export const VULNMAP_APP_CONTEXT = 'context';
export const VULNMAP_APP_DEBUG = 'vulnmap:apps';

export enum EValidSubCommands {
  CREATE = 'create',
}

export enum EAppsURL {
  CREATE_APP,
}

export const validAppsSubCommands = Object.values<string>(EValidSubCommands);

export const AppsErrorMessages = {
  orgRequired: `Option '--org' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'vulnmap apps --help' or 'vulnmap apps -h'.`,
  nameRequired: `Option '--name' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'vulnmap apps --help' or 'vulnmap apps -h'.`,
  redirectUrisRequired: `Option '--redirect-uris' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'vulnmap apps --help' or 'vulnmap apps -h'.`,
  scopesRequired: `Option '--scopes' is required! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'vulnmap apps --help' or 'vulnmap apps -h'.`,
  invalidContext: `Option '--context' must be either 'tenant' or 'user'! For interactive mode, please use '--interactive' or '-i' flag. For more information please run the help command 'vulnmap apps --help' or 'vulnmap apps -h'.`,
  useExperimental: `\n${chalk.redBright(
    "All 'apps' commands are only accessible behind the '--experimental' flag.",
  )}\n
The behaviour can change at any time, without prior notice.
You are kindly advised to use all the commands with caution.

${chalk.bold('Usage')}
  ${chalk.italic('vulnmap apps <COMMAND> --experimental')}\n`,
};

export const CreateAppPromptData = {
  VULNMAP_APP_NAME: {
    name: VULNMAP_APP_NAME,
    message: `Name of the Vulnmap App (visible to users when they install the Vulnmap App)?`,
  },
  VULNMAP_APP_REDIRECT_URIS: {
    name: VULNMAP_APP_REDIRECT_URIS,
    message: `Your Vulnmap App's redirect URIs (comma seprated list. ${chalk.yellowBright(
      ' Ex: https://example1.com,https://example2.com',
    )})?: `,
  },
  VULNMAP_APP_SCOPES: {
    name: VULNMAP_APP_SCOPES,
    message: `Your Vulnmap App's permission scopes (comma separated list. ${chalk.yellowBright(
      ' Ex: org.read,org.report.read',
    )})?: `,
  },
  VULNMAP_APP_ORG_ID: {
    name: VULNMAP_APP_ORG_ID,
    message:
      'Please provide the org id under which you want to create your Vulnmap App: ',
  },
  VULNMAP_APP_CONTEXT: {
    name: VULNMAP_APP_CONTEXT,
    message: 'Which context will your app operate under: ',
  },
};
