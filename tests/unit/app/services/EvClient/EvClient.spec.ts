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
