import RedirectController from '@ringcentral-integration/widgets/lib/RedirectController';

export default new RedirectController({
  prefix: 'cx-embeddable',
  appOrigin: window.location.origin,
});
