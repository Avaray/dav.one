/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PRODUCTION_BUILD: boolean;
  readonly CF_ZONE_ID: string;
  readonly CF_RADAR_TOKEN: string;
  readonly GOOGLE_PAGESPEED_KEY: string;
  readonly POSTHOG_API_KEY: string;
  readonly POSTHOG_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css?url" {
  const url: string;
  export default url;
}
