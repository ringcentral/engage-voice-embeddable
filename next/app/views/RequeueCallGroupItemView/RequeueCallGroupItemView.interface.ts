/**
 * Options for RequeueCallGroupItemView customization
 */
interface RequeueCallGroupItemViewOptions {
  onRequeueComplete?: () => void;
  onCancel?: () => void;
}

/**
 * Props passed to the RequeueCallGroupItemView component
 */
interface RequeueCallGroupItemViewProps {
  id?: string;
  groupId?: string;
}

export type { RequeueCallGroupItemViewOptions, RequeueCallGroupItemViewProps };
