export function getClientIdReducer({ types }) {
  return (state = '', { type, clientId }) => {
    if (type === types.setData) return clientId;
    return state;
  };
}

export function getClientSecretReducer({ types }) {
  return (state = '', { type, clientSecret }) => {
    if (type === types.setData) return clientSecret;
    return state;
  };
}

export function getEngageVoiceServerReducer({ types, defaultServer }) {
  return (state = defaultServer, { type, evAuthServer }) => {
    if (type === types.setData) return evAuthServer;
    return state;
  };
}

