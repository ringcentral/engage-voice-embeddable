import type {
  HeaderViewOptions as BaseHeaderViewOptions,
  HeaderViewProps as BaseHeaderViewProps,
  HeaderContainerProps as BaseHeaderContainerProps,
} from '@ringcentral-integration/micro-core/src/app/views/HeaderView/Header.view.interface';

/**
 * Extended HeaderView configuration options
 */
export interface HeaderViewOptions extends BaseHeaderViewOptions {
  /**
   * Custom configuration for the header view
   */
}

/**
 * Extended HeaderView component props
 */
export interface HeaderViewProps extends BaseHeaderViewProps {
  /**
   * Additional props for the extended header view
   */
}

/**
 * Extended HeaderView container props
 */
export interface HeaderContainerProps extends BaseHeaderContainerProps {
  /**
   * Additional container props for the extended header view
   */
}
