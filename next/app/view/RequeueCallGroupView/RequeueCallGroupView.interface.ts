/**
 * Options for RequeueCallGroupView customization
 */
interface RequeueCallGroupViewOptions {
  onCancel?: () => void;
}

/**
 * Props passed to the RequeueCallGroupView component
 */
interface RequeueCallGroupViewProps {
  id?: string;
}

export type { RequeueCallGroupViewOptions, RequeueCallGroupViewProps };
