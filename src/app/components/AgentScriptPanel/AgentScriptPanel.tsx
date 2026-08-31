import React from 'react';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';

import type { AgentScriptPanelProps } from './AgentScriptPanel.interface';
import { AgentScriptFrame } from './AgentScriptFrame';
import i18n from './i18n';

export function AgentScriptPanel(props: AgentScriptPanelProps) {
  const { callId, script, loading, error, showTitle = true } = props;
  const { t } = useLocale(i18n);

  return (
    <section
      aria-label={t('agentScript')}
      data-sign="agentScriptPanel"
      className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-neutral-base"
    >
      {showTitle && (
        <div className="flex h-12 flex-shrink-0 items-center border-b border-neutral-b4 px-4">
          <h2 className="typography-title text-neutral-b0">
            {t('agentScript')}
          </h2>
        </div>
      )}
      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {loading ? (
          <div
            className="flex h-full items-center justify-center text-neutral-b2"
            data-sign="agentScriptLoading"
          >
            <span className="typography-mainText">
              {t('loadingAgentScript')}
            </span>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex h-full items-center justify-center p-6 text-center text-danger"
            data-sign="agentScriptError"
          >
            <span className="typography-mainText">{error}</span>
          </div>
        ) : script ? (
          <AgentScriptFrame key={callId} {...props} />
        ) : (
          <div
            className="flex h-full items-center justify-center text-neutral-b2"
            data-sign="agentScriptEmpty"
          >
            <span className="typography-mainText">{t('noAgentScript')}</span>
          </div>
        )}
      </div>
    </section>
  );
}
