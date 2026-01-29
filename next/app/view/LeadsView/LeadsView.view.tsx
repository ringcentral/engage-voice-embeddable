import React from 'react';
import {
  injectable,
  optional,
  RcViewModule,
  useConnector,
} from '@ringcentral-integration/next-core';
import { useLocale } from '@ringcentral-integration/micro-core/src/app/hooks';

import { EvLeads } from '../../services/EvLeads';
import type { Lead } from '../../services/EvLeads';
import i18n from './i18n';

/**
 * LeadsView options for configuration
 */
export interface LeadsViewOptions {
  // Optional configuration options
}

/**
 * LeadsView module - Leads panel
 * Shows leads list with dial functionality
 */
@injectable({
  name: 'LeadsView',
})
class LeadsView extends RcViewModule {
  constructor(
    private evLeads: EvLeads,
    @optional('LeadsViewOptions')
    private leadsViewOptions?: LeadsViewOptions,
  ) {
    super();
  }

  fetchLeads = async () => {
    await this.evLeads.fetchLeads();
  };

  dialLead = async (lead: Lead, destination: string) => {
    await this.evLeads.dialLead(lead, destination);
  };

  component() {
    const { t } = useLocale(i18n);

    const { filteredLeads, loading, noLeadsReturned } = useConnector(() => ({
      filteredLeads: this.evLeads.filteredLeads,
      loading: this.evLeads.loading,
      noLeadsReturned: this.evLeads.noLeadsReturned,
    }));

    return (
      <div className="flex flex-col h-full bg-neutral-base">
        <div className="p-4 border-b border-neutral-b4 flex justify-between items-center">
          <h1 className="typography-title">{t('leads')}</h1>
          <button
            onClick={this.fetchLeads}
            disabled={loading}
            className="px-4 py-2 typography-subtitle bg-cobranding text-cobranding-on-accent rounded hover:bg-cobranding-f disabled:opacity-50"
          >
            {loading ? t('loading') : t('fetchLeads')}
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {filteredLeads.length === 0 ? (
            <div className="p-4 text-center text-neutral-b2">
              <p className="typography-mainText">
                {noLeadsReturned ? t('noLeadsReturned') : t('noLeads')}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-b4">
              {filteredLeads.map((lead) => {
                const destination = Array.isArray(lead.destination)
                  ? lead.destination[0]
                  : lead.destination;
                return (
                  <li
                    key={lead.leadId}
                    className="p-4 hover:bg-neutral-b5"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="typography-subtitle">
                          {lead.firstName} {lead.lastName}
                        </span>
                        <span className="typography-descriptor text-neutral-b2 ml-2">
                          {lead.leadState}
                        </span>
                      </div>
                    </div>
                    <div className="typography-mainText text-neutral-b2 mb-2">
                      {destination}
                    </div>
                    <button
                      onClick={() => this.dialLead(lead, destination)}
                      className="px-3 py-1 typography-descriptor bg-success text-neutral-w0 rounded hover:bg-success-f"
                    >
                      {t('dial')}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export { LeadsView };
