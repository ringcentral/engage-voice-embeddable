jest.mock('@ringcentral-integration/next-core', () => ({
  action: (_target: any, _key: string, descriptor: PropertyDescriptor) =>
    descriptor,
  inject: () => () => undefined,
  injectable: () => (target: any) => target,
  optional: () => () => undefined,
  state: () => undefined,
  delegate:
    () =>
      (_target: any, _key: string, descriptor: PropertyDescriptor) =>
        descriptor,
  RcModule: class {},
  PortManager: class {},
}));

jest.mock('src/app/services/Environment', () => ({
  Environment: class {},
}));

import { EvClient } from 'src/app/services/EvClient';

describe('EvClient softphone authentication', () => {
  it('propagates a newly authenticated Engage token to the softphone', async () => {
    let mainToken = 'expired-token';
    const softphoneAuthenticateRequest = {
      engageAccessToken: 'expired-token',
    };
    const sdk = {
      getAuthenticateRequest: jest.fn(() => ({
        engageAccessToken: mainToken,
      })),
      _SoftphoneService: {
        getUIModel: jest.fn(() => ({
          getInstance: jest.fn(() => ({
            authenticateRequest: softphoneAuthenticateRequest,
          })),
        })),
      },
      authenticateAgentWithEngageAccessToken: jest.fn(
        (_token: string, callback: (response: object) => void) => {
          mainToken = 'current-token';
          callback({});
        },
      ),
    };
    const client = Object.create(EvClient.prototype) as EvClient;
    (client as any)._sdk = sdk;

    await client.authenticateAgentWithEngageAccessToken('current-token');

    expect(softphoneAuthenticateRequest.engageAccessToken).toBe(
      'current-token',
    );
  });

  it('uses the current Engage token when switching registrars', async () => {
    const softphoneAuthenticateRequest = {
      engageAccessToken: 'expired-token',
    };
    const sdk = {
      getAuthenticateRequest: jest.fn(() => ({
        engageAccessToken: 'current-token',
      })),
      _SoftphoneService: {
        getUIModel: jest.fn(() => ({
          getInstance: jest.fn(() => ({
            authenticateRequest: softphoneAuthenticateRequest,
          })),
        })),
      },
      switchSoftphoneRegistrar: jest.fn().mockImplementation(async () => {
        expect(softphoneAuthenticateRequest.engageAccessToken).toBe(
          'current-token',
        );
      }),
    };
    const client = Object.create(EvClient.prototype) as EvClient;
    (client as any)._sdk = sdk;

    await client.switchSoftphoneRegistrar(true);

    expect(softphoneAuthenticateRequest.engageAccessToken).toBe(
      'current-token',
    );
    expect(sdk.switchSoftphoneRegistrar).toHaveBeenCalledWith(true);
  });
});

describe('EvClient voicemail transfer', () => {
  const AUTH_HOST = 'https://ringcx.example.test';
  const RC_ACCOUNT_ID = '37233001';
  const EXTENSION_ID = '265162001';
  const VOICEMAIL_DEST = '+16504360000*101@RC_EXT';

  function createClient(sdk: Record<string, any> = {}) {
    const client = Object.create(EvClient.prototype) as EvClient;
    Object.assign(client as any, {
      _sdk: {
        getAuthenticateRequest: () => ({ engageAccessToken: 'engage-token' }),
        ...sdk,
      },
      _options: { authHost: AUTH_HOST },
      logger: { error: jest.fn() },
    });
    jest
      .spyOn(client, 'getFullUserDetails')
      .mockReturnValue({ rcAccountId: RC_ACCOUNT_ID });
    return client;
  }

  afterEach(() => {
    delete (global as any).fetch;
  });

  it('sends the destination as a cold transfer to voicemail', async () => {
    const sendToVoicemailForRingEXNumber = jest.fn(
      (_dest: string, callback: (data: object) => void) =>
        callback({ status: 'OK' }),
    );
    const client = createClient({ sendToVoicemailForRingEXNumber });

    await expect(client.voicemailTransferCall(VOICEMAIL_DEST)).resolves.toEqual({
      status: 'OK',
    });
    expect(sendToVoicemailForRingEXNumber).toHaveBeenCalledWith(
      VOICEMAIL_DEST,
      expect.any(Function),
    );
  });

  it('rejects a voicemail transfer the server refuses', async () => {
    const client = createClient({
      sendToVoicemailForRingEXNumber: (
        _dest: string,
        callback: (data: object) => void,
      ) => callback({ status: 'FAILURE', message: 'refused' }),
    });

    await expect(client.voicemailTransferCall(VOICEMAIL_DEST)).rejects.toEqual({
      status: 'FAILURE',
      message: 'refused',
    });
  });

  it('asks the permission endpoint about the extension of the agent account', async () => {
    const fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ voiceMailEnabled: true }),
    });
    (global as any).fetch = fetch;

    await expect(createClient().checkVoicemail(EXTENSION_ID)).resolves.toEqual({
      status: 200,
      voiceMailEnabled: true,
    });
    const [url, init] = fetch.mock.calls[0];
    const { origin, pathname, searchParams } = new URL(url);
    expect(`${origin}${pathname}`).toBe(
      `${AUTH_HOST}/api/v1/extension-permissions/check-voicemail`,
    );
    expect(searchParams.get('targetExtensionId')).toBe(EXTENSION_ID);
    expect(searchParams.get('targetAccountId')).toBe(RC_ACCOUNT_ID);
    expect(init.headers.Authorization).toBe('Bearer engage-token');
  });

  it('returns an error status as a value so the caller can refresh on 401', async () => {
    const json = jest.fn();
    (global as any).fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 401, json });

    await expect(createClient().checkVoicemail(EXTENSION_ID)).resolves.toEqual({
      status: 401,
      voiceMailEnabled: false,
    });
    expect(json).not.toHaveBeenCalled();
  });

  it('reports status 0 when the request cannot be made', async () => {
    (global as any).fetch = jest
      .fn()
      .mockRejectedValue(new TypeError('offline'));
    const client = createClient();

    await expect(client.checkVoicemail(EXTENSION_ID)).resolves.toEqual({
      status: 0,
      voiceMailEnabled: false,
    });
    expect((client as any).logger.error).toHaveBeenCalled();
  });

  it('does not call the endpoint without an RC account', async () => {
    const fetch = jest.fn();
    (global as any).fetch = fetch;
    const client = createClient();
    (client.getFullUserDetails as jest.Mock).mockReturnValue(undefined);

    await expect(client.checkVoicemail(EXTENSION_ID)).resolves.toEqual({
      status: 0,
      voiceMailEnabled: false,
    });
    expect(fetch).not.toHaveBeenCalled();
  });
});
