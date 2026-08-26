/**
 * The agent library reports `ani`/`dnis` in whatever shape the carrier sent
 * them, which `formatPhoneNumber` frequently cannot parse. The same
 * notifications also carry `ani_e164`/`dnis_e164`, so prefer those as the raw
 * value to format and only fall back to `ani`/`dnis` when the notification
 * omitted the E.164 form.
 */
interface EvCallNumberSource {
  ani?: string;
  dnis?: string;
  aniE164?: string;
  dnisE164?: string;
}

export function getCallAni(call?: EvCallNumberSource | null): string {
  return call?.aniE164 || call?.ani || '';
}

export function getCallDnis(call?: EvCallNumberSource | null): string {
  return call?.dnisE164 || call?.dnis || '';
}
