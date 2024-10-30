import { Module } from '@ringcentral-integration/commons/lib/di';
import {
  computed,
} from '@ringcentral-integration/core';
import { EvManualDialSettingsUI as BaseEvManualDialSettingsUI } from '@ringcentral-integration/engage-voice-widgets/modules/EvManualDialSettingsUI';

@Module({
  deps: [],
})
class EvManualDialSettingsUI extends BaseEvManualDialSettingsUI {
  // override to fix country not found issue.
  @computed((that: EvManualDialSettingsUI) => [
    that._deps.evAuth.availableCountries,
    that._deps.evCall.formGroup.dialoutCountryId,
  ])
  get country() {
    const find = this._deps.evAuth.availableCountries.find(
      (country) =>
        country.countryId === this._deps.evCall.formGroup.dialoutCountryId,
    );
    if (!find) {
      return this._deps.evAuth.availableCountries[0];
    }
    return find;
  }
}

export { EvManualDialSettingsUI };
