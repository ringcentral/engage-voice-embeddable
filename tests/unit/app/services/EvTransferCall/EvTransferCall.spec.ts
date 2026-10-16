jest.mock('@ringcentral-integration/next-core', () => ({
  action: (_target: any, _key: string, descriptor: PropertyDescriptor) =>
    descriptor,
  computed:
    () =>
      (_target: any, _key: string, descriptor: PropertyDescriptor) =>
        descriptor,
  delegate:
    () =>
      (_target: any, _key: string, descriptor: PropertyDescriptor) =>
        descriptor,
  injectable: () => (target: any) => target,
  optional: () => () => undefined,
  state: () => undefined,
  storage: () => undefined,
  RcModule: class {},
  StoragePlugin: class {},
}));

jest.mock('@ringcentral-integration/micro-core/src/app/services', () => ({
  Locale: class {},
  Toast: class {},
}));

// Module barrels stand in for DI tokens only
jest.mock('src/app/services/EvClient', () => ({ EvClient: class {} }));
jest.mock('src/app/services/EvAuth', () => ({ EvAuth: class {} }));
jest.mock('src/app/services/EvCall', () => ({ EvCall: class {} }));
jest.mock('src/app/services/EvActiveCallControl', () => ({
  EvActiveCallControl: class {},
}));
jest.mock('src/app/services/EvWorkingState', () => ({
  EvWorkingState: class {},
}));
jest.mock('src/app/services/EvSubscription', () => ({
  EvSubscription: class {},
}));
jest.mock('src/app/services/EvAgentSession', () => ({
  EvAgentSession: class {},
}));

import { EvTransferCall } from 'src/app/services/EvTransferCall/EvTransferCall';
import {
  directTransferTypes,
  transferErrors,
  transferTypes,
} from 'src/enums';

const EXTENSION_ID = '265162001';
const VOICEMAIL_DEST = '+16504360000*101@RC_EXT';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function createTransferCall() {
  const evClient = {
    checkVoicemail: jest.fn(),
    voicemailTransferCall: jest.fn().mockResolvedValue({ status: 'OK' }),
    coldTransferCall: jest.fn(),
    warmTransferCall: jest.fn(),
    coldDirectAgentTransfer: jest.fn(),
    warmDirectAgentTransfer: jest.fn(),
    fetchDirectAgentList: jest.fn().mockResolvedValue({ agents: [] }),
  };
  const evAuth = {
    refreshEvToken: jest.fn().mockResolvedValue(true),
    // The agent config always lists USA, the country a directory destination
    // is dialed under
    availableCountries: [{ countryId: 'USA', countryCode: '1' }],
    agentPermissions: {},
  };
  const transferCall = new (EvTransferCall as any)(
    evClient,
    evAuth,
    { currentCall: null },
    { holdAndConfirm: jest.fn(), setUnholdOnHangup: jest.fn() },
    {},
    {},
    {},
    {},
    {},
    { enable: jest.fn() },
  ) as EvTransferCall;
  // Field initializers stand in for the mocked @state/@storage
  transferCall.resetTransferStatus();
  return { transferCall, evClient, evAuth };
}

function pickDirectoryUser(transferCall: EvTransferCall) {
  transferCall.changeTransferType(transferTypes.manualEntry);
  transferCall.changeRecipientNumber(VOICEMAIL_DEST, { skipParse: true });
}

describe('EvTransferCall voicemail check', () => {
  it('caches a confirmed voicemail permission per extension', async () => {
    const { transferCall, evClient } = createTransferCall();
    evClient.checkVoicemail.mockResolvedValue({
      status: 200,
      voiceMailEnabled: true,
    });

    await expect(transferCall.checkVoicemail(EXTENSION_ID)).resolves.toBe(true);
    await expect(transferCall.checkVoicemail(EXTENSION_ID)).resolves.toBe(true);

    expect(evClient.checkVoicemail).toHaveBeenCalledTimes(1);
    expect(transferCall.voicemailEnabledByExtension).toEqual({
      [EXTENSION_ID]: true,
    });
  });

  it('caches a voicemail the server says is off', async () => {
    const { transferCall, evClient } = createTransferCall();
    evClient.checkVoicemail.mockResolvedValue({
      status: 200,
      voiceMailEnabled: false,
    });

    await expect(transferCall.checkVoicemail(EXTENSION_ID)).resolves.toBe(false);
    expect(transferCall.voicemailEnabledByExtension).toEqual({
      [EXTENSION_ID]: false,
    });
  });

  it('shares one request between concurrent checks of an extension', async () => {
    const { transferCall, evClient } = createTransferCall();
    const response = deferred<object>();
    evClient.checkVoicemail.mockReturnValue(response.promise);

    const first = transferCall.checkVoicemail(EXTENSION_ID);
    const second = transferCall.checkVoicemail(EXTENSION_ID);
    response.resolve({ status: 200, voiceMailEnabled: true });

    await expect(Promise.all([first, second])).resolves.toEqual([true, true]);
    expect(evClient.checkVoicemail).toHaveBeenCalledTimes(1);
  });

  it('refreshes the Engage token on 401 and checks again', async () => {
    const { transferCall, evClient, evAuth } = createTransferCall();
    evClient.checkVoicemail
      .mockResolvedValueOnce({ status: 401, voiceMailEnabled: false })
      .mockResolvedValueOnce({ status: 200, voiceMailEnabled: true });

    await expect(transferCall.checkVoicemail(EXTENSION_ID)).resolves.toBe(true);

    expect(evAuth.refreshEvToken).toHaveBeenCalledTimes(1);
    expect(evClient.checkVoicemail).toHaveBeenCalledTimes(2);
  });

  it('gives up without caching when the token cannot be refreshed', async () => {
    const { transferCall, evClient, evAuth } = createTransferCall();
    evClient.checkVoicemail.mockResolvedValue({
      status: 401,
      voiceMailEnabled: false,
    });
    evAuth.refreshEvToken.mockResolvedValue(false);

    await expect(transferCall.checkVoicemail(EXTENSION_ID)).resolves.toBe(false);

    expect(evClient.checkVoicemail).toHaveBeenCalledTimes(1);
    expect(transferCall.voicemailEnabledByExtension).toEqual({});
  });

  it('does not cache a failed check, so the next check asks again', async () => {
    const { transferCall, evClient } = createTransferCall();
    evClient.checkVoicemail
      .mockResolvedValueOnce({ status: 500, voiceMailEnabled: false })
      .mockResolvedValueOnce({ status: 200, voiceMailEnabled: true });

    await expect(transferCall.checkVoicemail(EXTENSION_ID)).resolves.toBe(false);
    expect(transferCall.voicemailEnabledByExtension).toEqual({});

    await expect(transferCall.checkVoicemail(EXTENSION_ID)).resolves.toBe(true);
    expect(evClient.checkVoicemail).toHaveBeenCalledTimes(2);
  });

  it('a reset forgets checked extensions and drops one in flight', async () => {
    const { transferCall, evClient } = createTransferCall();
    evClient.checkVoicemail.mockResolvedValueOnce({
      status: 200,
      voiceMailEnabled: true,
    });
    await transferCall.checkVoicemail(EXTENSION_ID);
    transferCall.resetTransferStatus();
    expect(transferCall.voicemailEnabledByExtension).toEqual({});

    const response = deferred<object>();
    evClient.checkVoicemail.mockReturnValueOnce(response.promise);
    const pending = transferCall.checkVoicemail(EXTENSION_ID);
    transferCall.resetTransferStatus();
    response.resolve({ status: 200, voiceMailEnabled: true });
    await pending;

    expect(transferCall.voicemailEnabledByExtension).toEqual({});
  });
});

describe('EvTransferCall transfer modes', () => {
  it('sends a directory destination to voicemail', async () => {
    const { transferCall, evClient } = createTransferCall();
    pickDirectoryUser(transferCall);

    await transferCall.transfer(directTransferTypes.VOICEMAIL);

    expect(evClient.voicemailTransferCall).toHaveBeenCalledWith(VOICEMAIL_DEST);
    expect(evClient.coldTransferCall).not.toHaveBeenCalled();
    expect(evClient.warmTransferCall).not.toHaveBeenCalled();
  });

  it('refuses voicemail for a destination outside the directory', async () => {
    const { transferCall, evClient } = createTransferCall();
    transferCall.changeTransferType(transferTypes.manualEntry);
    transferCall.changeRecipientNumber('+16505550100');

    await expect(
      transferCall.voicemailTransferCall('+16505550100'),
    ).rejects.toMatchObject({ type: transferErrors.SEND_VOICEMAIL_ERROR });
    expect(evClient.voicemailTransferCall).not.toHaveBeenCalled();
  });

  it('refuses voicemail for an agent transfer', async () => {
    const { transferCall, evClient } = createTransferCall();
    transferCall.changeTransferType(transferTypes.internal);
    transferCall.changeTransferAgentId('1001');

    await expect(
      transferCall.transfer(directTransferTypes.VOICEMAIL),
    ).rejects.toMatchObject({ type: transferErrors.TYPE_ERROR });
    expect(evClient.coldDirectAgentTransfer).not.toHaveBeenCalled();
    expect(evClient.warmDirectAgentTransfer).not.toHaveBeenCalled();
  });

  it('Ask first and Transfer route warm and cold', async () => {
    const { transferCall, evClient } = createTransferCall();
    pickDirectoryUser(transferCall);

    await transferCall.transfer(directTransferTypes.WARM);
    await transferCall.transfer(directTransferTypes.COLD);

    expect(evClient.warmTransferCall).toHaveBeenCalledWith({
      dialDest: VOICEMAIL_DEST,
    });
    expect(evClient.coldTransferCall).toHaveBeenCalledWith({
      dialDest: VOICEMAIL_DEST,
    });
    expect(evClient.voicemailTransferCall).not.toHaveBeenCalled();
  });

  it('routes an agent transfer warm or cold by mode', async () => {
    const { transferCall, evClient } = createTransferCall();
    // The agent list is refreshed before the transfer and has to keep the pick
    evClient.fetchDirectAgentList.mockResolvedValue({
      agents: [{ agentId: '1001' }],
    });
    transferCall.changeTransferType(transferTypes.internal);
    transferCall.changeTransferAgentId('1001');

    await transferCall.transfer(directTransferTypes.WARM);
    await transferCall.transfer(directTransferTypes.COLD);

    expect(evClient.warmDirectAgentTransfer).toHaveBeenCalledWith('1001');
    expect(evClient.coldDirectAgentTransfer).toHaveBeenCalledWith('1001');
  });
});
