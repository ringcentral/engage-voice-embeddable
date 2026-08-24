import { useEffect } from 'react';

/**
 * Viewport width below which the side-by-side layout is not attempted: the
 * 300px main column plus a usable panel beside it.
 */
export const SIDE_BY_SIDE_MIN_WIDTH = 560;

/**
 * Width the app can actually be seen in.
 *
 * The popped-out window is the reason this is not just `window.innerWidth`: the
 * host adapter forces our container to the expanded width while the window
 * itself stays narrow and clips the overflow without a scrollbar, so the frame
 * reports far more room than the agent can see. When the parent is same-origin
 * we can read its width and take the smaller of the two; a cross-origin host
 * throws, and there our own viewport is the honest answer.
 */
function getUsableWidth(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return window.parent !== window
      ? Math.min(window.innerWidth, window.parent.innerWidth)
      : window.innerWidth;
  } catch {
    return window.innerWidth;
  }
}

export function canExpandLayoutForWidth(width: number): boolean {
  return width >= SIDE_BY_SIDE_MIN_WIDTH;
}

/**
 * Report to `SideWidget` whether this client has room for the side-by-side
 * layout, now and whenever the window is resized.
 *
 * Only the boolean is reported, never the width: `setCanExpandLayout` runs
 * through a redux action, and a per-pixel report during a window drag would
 * trip the framework's action-frequency guard.
 */
export function useSideWidgetLayout(
  setCanExpandLayout: (canExpandLayout: boolean) => Promise<void>,
): void {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let last: boolean | null = null;
    const report = () => {
      const next = canExpandLayoutForWidth(getUsableWidth());
      if (next === last) return;
      last = next;
      void setCanExpandLayout(next);
    };
    report();
    window.addEventListener('resize', report);
    return () => window.removeEventListener('resize', report);
  }, [setCanExpandLayout]);
}
