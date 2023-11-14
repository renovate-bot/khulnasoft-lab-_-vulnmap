import { CreateAppPromptData } from './constants';
import { validInput, validateAllURL, validateUUID } from './input-validator';

/**
 * Prompts for $vulnmap apps create command
 */
export const createAppPrompts = [
  {
    name: CreateAppPromptData.VULNMAP_APP_NAME.name,
    type: 'input',
    message: CreateAppPromptData.VULNMAP_APP_NAME.message,
    validate: validInput,
  },
  {
    name: CreateAppPromptData.VULNMAP_APP_REDIRECT_URIS.name,
    type: 'input',
    message: CreateAppPromptData.VULNMAP_APP_REDIRECT_URIS.message,
    validate: validateAllURL,
  },
  {
    name: CreateAppPromptData.VULNMAP_APP_SCOPES.name,
    type: 'input',
    message: CreateAppPromptData.VULNMAP_APP_SCOPES.message,
    validate: validInput,
  },
  {
    name: CreateAppPromptData.VULNMAP_APP_ORG_ID.name,
    type: 'input',
    message: CreateAppPromptData.VULNMAP_APP_ORG_ID.message,
    validate: validateUUID,
  },
  {
    name: CreateAppPromptData.VULNMAP_APP_CONTEXT.name,
    type: 'select',
    message: CreateAppPromptData.VULNMAP_APP_CONTEXT.message,
    choices: ['tenant', 'user'],
    initial: 'tenant',
  },
];
