import { useCallback, useMemo } from 'react';

import type {
  AlertSeverity,
  EvAlertMessageTypes,
  UseEvAlertOptions,
} from './EvAlertRenderer.interface';
import i18n from './i18n';

/**
 * Default severity mapping for alert types
 */
const defaultSeverityMap: Partial<Record<EvAlertMessageTypes, AlertSeverity>> = {
  // All errors default to 'error' severity
};

/**
 * Get the severity for an alert type
 */
function getSeverityForType(
  type: EvAlertMessageTypes,
): AlertSeverity {
  return defaultSeverityMap[type] || 'error';
}

/**
 * Hook to get EV alert message utilities
 *
 * Provides methods to get localized alert messages for use with Toast service.
 *
 * @example
 * ```tsx
 * const { getAlertMessage } = useEvAlert({ currentLocale: 'en-US' });
 *
 * // Use with Toast service
 * toast.error(getAlertMessage(EvAlertMessageTypes.CONNECT_ERROR));
 * ```
 */
export function useEvAlert(options: UseEvAlertOptions = {}) {
  const { currentLocale = 'en-US', messageOverrides = {} } = options;

  /**
   * Get localized message for an alert type
   */
  const getAlertMessage = useCallback(
    (type: EvAlertMessageTypes): string => {
      // Check for override first
      if (messageOverrides[type]) {
        return messageOverrides[type]!;
      }
      // Fall back to i18n
      return i18n.getString(type, currentLocale);
    },
    [currentLocale, messageOverrides],
  );

  /**
   * Get severity for an alert type
   */
  const getAlertSeverity = useCallback(
    (type: EvAlertMessageTypes): AlertSeverity => {
      return getSeverityForType(type);
    },
    [],
  );

  /**
   * Get both message and severity for an alert type
   */
  const getAlert = useCallback(
    (type: EvAlertMessageTypes) => {
      return {
        message: getAlertMessage(type),
        severity: getAlertSeverity(type),
      };
    },
    [getAlertMessage, getAlertSeverity],
  );

  return useMemo(
    () => ({
      getAlertMessage,
      getAlertSeverity,
      getAlert,
    }),
    [getAlertMessage, getAlertSeverity, getAlert],
  );
}

/**
 * Get alert message synchronously (for use outside React components)
 */
export function getEvAlertMessage(
  type: EvAlertMessageTypes,
  currentLocale: string = 'en-US',
): string {
  return i18n.getString(type, currentLocale);
}

/**
 * Check if a message type is an EV alert
 */
export function isEvAlertType(type: string): type is EvAlertMessageTypes {
  return Object.values(i18n.currentMessages).hasOwnProperty(type);
}
