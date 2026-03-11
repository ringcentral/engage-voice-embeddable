/**
 * Engage Voice track events for analytics
 */
export const trackEvents = {
  // EvAgentSession, Voice Connection & Persistent Voice Connection
  agentSessionSetLoginType: 'User Setting: Set Voice Connection',
  agentSessionSetTakingCall: 'User Setting: Set Persistent Voice Connection',
  agentSessionSetSkillProfileId: 'User Setting: Set Skill Profile',
  agentSessionSetInboundQueueIds: 'User Setting: Set Inbound Queue',
  agentSessionSetAutoAnswer: 'User Setting: Set Auto Answer',
  agentSessionConfigureAgent: 'User Setting: Configure Agent',

  // EvAuth, Authentication & Login & Agent UserId
  loginAgent: 'User Setting: Login Agent',
} as const;

export type TrackEvents = (typeof trackEvents)[keyof typeof trackEvents];
