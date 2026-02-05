import { messageTypes } from '../../../../enums';

export default {
  // Call alert messages
  [messageTypes.NO_SUPPORT_COUNTRY]:
    'Outbound calls outside the U.S. and Canada are not yet supported.',
  [messageTypes.FAILED_TO_CALL]:
    'The line is busy or has a pending disposition.',
  [messageTypes.INTERCEPT]:
    'The dial result for your manual outbound call was INTERCEPT.',
  [messageTypes.COPY_UII_SUCCESS]: 'Call ID copied',
} as const;
