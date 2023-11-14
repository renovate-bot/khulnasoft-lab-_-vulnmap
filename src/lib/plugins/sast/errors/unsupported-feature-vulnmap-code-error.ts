import { CustomError } from '../../../errors/custom-error';

export class FeatureNotSupportedByVulnmapCodeError extends CustomError {
  public readonly feature: string;

  constructor(feature: string, additionalUserHelp = '') {
    super(`Unsupported action for ${feature}.`);
    this.code = 422;
    this.feature = feature;

    this.userMessage = `'${feature}' is not supported for vulnmap code. ${additionalUserHelp}`;
  }
}
