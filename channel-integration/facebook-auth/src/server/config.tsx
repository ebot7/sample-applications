/**
 * Configuration
 */
import manifest from "../../public/manifest.json";

/** Whether we're running on a local desktop or on AWS Lambda */
const isLocal = process.env.IS_LOCAL || process.env.IS_OFFLINE;

/**
 * Configuration Options
 *
 * IMPORTANT:
 * The config is injected into the client (browser) and accessible through the {@link useConfig}
 * hook. However, due to this behavior, it is important NOT to expose any sensitive information
 * such as passwords or tokens through the config.
 */
const config = {
  /** Application Config */
  app: {
    /** Name of the app is loaded from the `manifest.json` */
    TITLE: manifest.short_name,
    /** Theme is also loaded from the `manifest.json` */
    THEME_COLOR: manifest.theme_color,
    /** URL to our public API Gateway endpoint */
    URL: isLocal
      ? `http://localhost:3000/${process.env.SERVERLESS_STAGE || "dev"}`
      : String(process.env.APIGATEWAY_URL),
    /** Where the bundled distribution files (`main.js`, `main.css`) are hosted */
    DIST_URL: isLocal ? "http://localhost:8080" : String(process.env.APP_DIST_URL),
    /** Where the contents of the `public` folder are hosted (might be the same as `config.app.DIST_URL`) */
    PUBLIC_URL: isLocal ? "http://localhost:8080" : String(process.env.APP_PUBLIC_URL),
  },
  fbAppId: '405351266499478',
  awsTable: "facebookAuth",
  awsConfiguration: {
    region: "eu-central-1",
    secretAccessKey: "2e5BnEN/Y50F3GjQEbXhGmr4qKbSvBp+vOTVSSR3",
    accessKeyId: "AKIAQ4KIGWM3GO5VYS7S",
  },
  appKey: 'xapp-60d1b2cbddf51f23bffd930d-34c596be761e99592e8d982a6764ed9355782bcc',

};

export type Config = typeof config;
export default config;
