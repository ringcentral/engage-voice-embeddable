export default function getHostingUrl(brand, env, version) {
  switch (env) {
    case 'preview':
      return {
        external: `https://apps.ringcentral.com/integration/salesforce-engage-voice/${env}/${brand}/v${version}/scripts/setup.js`,
        index: `https://apps.ringcentral.com/integration/salesforce-engage-voice/${env}/${brand}/v${version}/scripts/index.html`,
      };
    case 'production':
    case 'prod':
      return {
        external: `https://apps.ringcentral.com/integration/salesforce-engage-voice/prod/${brand}/v${version}/scripts/setup.js`,
        index: `https://apps.ringcentral.com/integration/salesforce-engage-voice/prod/${brand}/v${version}/scripts/index.html`,
      };
    case 'reg':
    case 'regression':
      return {
        external: `https://integration.lab.nordigy.ru:8872/salesforce-engage-voice/regression/${brand}/v${version}/scripts/setup.js`,
        index: `https://integration.lab.nordigy.ru:8872/salesforce-engage-voice/regression/${brand}/v${version}/scripts/index.html`,
      };
    case 'dev':
      return {
        external: `https://integration.lab.nordigy.ru:8872/salesforce-engage-voice/dev/${brand}/v${version}/scripts/setup.js`,
        index: `https://integration.lab.nordigy.ru:8872/salesforce-engage-voice/dev/${brand}/v${version}/scripts/index.html`,
      };
    case 'development':
      return {
        external: 'https://localhost:8080/setup.js',
        index: 'https://localhost:8080/index.html',
      };
    default:
      return {
        external: `https://integration.lab.nordigy.ru:8872/salesforce-engage-voice/dev/${brand}/v${version}/scripts/setup.js`,
        index: `https://integration.lab.nordigy.ru:8872/salesforce-engage-voice/dev/${brand}/v${version}/scripts/index.html`,
      };
  }
}
