export function getApiBaseUrl(): string {
  let apiBaseUrl = 'https://vulnmap.khulnasoft.com/api';
  if (process.env.VULNMAP_API) {
    if (process.env.VULNMAP_API.endsWith('/api')) {
      apiBaseUrl = process.env.VULNMAP_API;
    } else if (process.env.VULNMAP_API.endsWith('/api/v1')) {
      // vulnmap CI environment - we use `.../api/v1` though the norm is just `.../api`
      apiBaseUrl = process.env.VULNMAP_API.replace('/v1', '');
    } else {
      console.warn(
        'Malformed VULNMAP_API value. Using default: https://vulnmap.khulnasoft.com/api',
      );
    }
  }
  return apiBaseUrl;
}
