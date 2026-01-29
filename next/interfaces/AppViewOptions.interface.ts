import type { ReactNode } from 'react';

/**
 * Route configuration for AppView
 */
interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  authentication?: boolean;
}

/**
 * Optional configuration for AppView
 * Allows customization of routes and headers
 */
interface AppViewOptions {
  /**
   * Additional routes to be added to the app
   */
  routes?: RouteConfig[];
  /**
   * Custom header components to be rendered in the announcement area
   */
  headers?: ReactNode;
}

export type { AppViewOptions, RouteConfig };
