export function getOrganizationID(): string {
  if (process.env.VULNMAP_INTERNAL_ORGID != undefined) {
    return process.env.VULNMAP_INTERNAL_ORGID;
  }
  return '';
}
